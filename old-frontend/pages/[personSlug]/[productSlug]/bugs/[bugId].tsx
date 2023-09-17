import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Row, Col, message, Button, Spin, Typography, Breadcrumb} from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import {useRouter} from 'next/router';
import {useQuery, useMutation} from '@apollo/react-hooks';
import { GET_PRODUCT_BUG_BY_ID } from '../../../../graphql/queries';
import {DELETE_BUG, VOTE_BUG} from '../../../../graphql/mutations';
import {getProp} from '../../../../utilities/filters';
import {EditIcon} from '../../../../components';
import DeleteModal from '../../../../components/Products/DeleteModal';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';
import parse from "html-react-parser";
import {getUserRole, hasManagerRoots} from "../../../../utilities/utils";
import CustomAvatar2 from "../../../../components/CustomAvatar2";
import AddEditBug from "../../../../components/AddEditBug";
import Comments from "../../../../components/Comments";
import Head from "next/head";
import showUnAuthModal from "../../../../components/UnAuthModal";


type Params = {
  user?: any;
  loginUrl: string;
  registerUrl: string;
};

const Bug: React.FunctionComponent<Params> = ({user, loginUrl, registerUrl}) => {
  const router = useRouter();
  const {bugId, personSlug, productSlug} = router.query;

  const [deleteModal, showDeleteModal] = useState(false);
  const [bug, setBug] = useState<any>({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [voteType, setVoteType] = useState(0);

  const {data: bugData, error, loading, refetch} = useQuery(GET_PRODUCT_BUG_BY_ID, {
    variables: {id: bugId}
  });

  const userHasManagerRoots = hasManagerRoots(getUserRole(user.roles, productSlug));

  const getBasePath = () => `/${personSlug}/${productSlug}`;

  const [deleteBug] = useMutation(DELETE_BUG, {
    variables: {
      id: parseInt(bugId)
    },
    onCompleted() {
      message.success("Item is successfully deleted!").then();
      router.push(getBasePath() === "" ? "/" : `${getBasePath()}/ideas-and-bugs`).then();
    },
    onError(e) {
      if(e.message === "The person is undefined, please login to perform this action") {
        showUnAuthModal("perform this action", loginUrl, registerUrl, true);
      } else {      
        message.error("Failed to delete item!").then();
      }
    }
  });

  const [voteBug] = useMutation(VOTE_BUG, {
    variables: {
      input: {
        objectId: parseInt(bugId),
        voteType
      }
    },
    onCompleted: (msg) => {
      const {success, message: voteMessage} = msg.voteBug;
      message[success ? "success" : "error"](voteMessage).then();
      if (success) refetch();
    },
    onError: (e) => {
      if(e.message === "The person is undefined, please login to perform this action") {
        showUnAuthModal("perform this action", loginUrl, registerUrl, true);
      } else {      
        message.error(e.message).then()
      }
    }
  });

  useEffect(() => {
    if (bugData) setBug(bugData?.bug || {});
  }, [bugData]);

  const fetchData = async () => await refetch();

  return (
      <>
        <Head>
          <title>  {getProp(bug, 'headline', 'Bug')}</title>
          {/* `${getProp(bug, 'product.name', '')} ${getProp(bug, 'headline', 'Bug')}` => "Product name Bug headline" */}
          <meta name="description" content={ `${getProp(bug, 'product.name', '')} ${getProp(bug, 'headline', 'Bug')}` }/>
        </Head>
    <LeftPanelContainer>
      <Spin tip="Loading..." spinning={loading} delay={200}>
        {
          !error && (
            <>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <a href={getBasePath()}>{getProp(bug, 'product.name', '')}</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <a href={`${getBasePath()}/ideas-and-bugs`}>Ideas & Bugs</a>
                </Breadcrumb.Item>
              </Breadcrumb>

              <Row
                justify="space-between"
                className="right-panel-headline strong-height"
              >
                <Col md={16}>
                  <div className="section-title">
                    {getProp(bug, 'headline', '')}
                  </div>
                </Col>
                <Col md={8} className="text-right">
                  {userHasManagerRoots || getProp(bug, "person.id", undefined) === user.id && (
                    <Col>
                      <Button
                        onClick={() => showDeleteModal(true)}
                      >
                        Delete
                      </Button>
                      <EditIcon
                        className="ml-10"
                        onClick={() => setShowEditModal(true)}
                      />
                    </Col>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row className="html-description">
                    <Col style={{overflowX: 'auto', width: 'calc(100vw - 95px)', marginTop: 30}}>
                      {parse(getProp(bug, 'description', ''))}
                    </Col>
                  </Row>
                  <div className="mt-22">
                    <Row style={{marginTop: 10}} className="text-sm mt-8">
                      <strong className="my-auto">Bug Type: </strong>
                      &nbsp;{bug.bugType ? "Private" : "Public"}
                    </Row>
                    <Row style={{marginTop: 10}} className="text-sm mt-8">

                      {bug.person?.id === user.id ? (
                        <strong className="my-auto">Created By You</strong>
                      ) : (
                        <>
                          <strong className="my-auto">Created By: </strong>
                          <Row align="middle" style={{marginLeft: 15}}>
                            <Col>
                              <CustomAvatar2 person={{
                                firstName: getProp(bug, 'person.firstName', ''),
                                slug: getProp(bug, 'person.slug', '')
                              }}/>
                            </Col>
                            <Col>
                              <Typography.Link className="text-grey-9"
                                               href={`/${getProp(bug, 'person.slug', '')}`}>
                                {getProp(bug, 'person.firstName', '')}
                              </Typography.Link>
                            </Col>
                          </Row>
                        </>
                      )}
                    </Row>

                    {
                      bug.relatedCapability && (
                        <Row className="text-sm mt-8">
                          <strong className="my-auto">
                            Related Capability:
                          </strong>
                          <Typography.Link className="ml-5"
                                           href={`${getBasePath()}/capabilities/${getProp(bug, 'relatedCapability.id')}`}>
                            {getProp(bug, 'relatedCapability.name', '')}
                          </Typography.Link>
                        </Row>
                      )
                    }

                    <Row className="text-sm mt-8">
                      <strong>Votes:</strong>&nbsp;{bug.voteUp}
                    </Row>

                    {user.isLoggedIn && user.id !== bug?.person?.id && (
                      <Row className="text-sm mt-15">
                        <Button icon={<ArrowUpOutlined />}
                                type="primary"
                                onClick={voteBug}>Upvote</Button>
                      </Row>
                    )}

                  </div>
                </Col>
              </Row>

              <div style={{marginTop: 30}} />

              <Comments objectId={bug?.id || 0} objectType="bug" />

              {deleteModal && (
                <DeleteModal
                  modal={deleteModal}
                  closeModal={() => showDeleteModal(false)}
                  submit={deleteBug}
                  title="Delete bug"
                  description="Are you sure you want to delete Bug?"
                />
              )}
              {
                showEditModal &&
                <AddEditBug
                    modal={showEditModal}
                    productSlug={productSlug}
                    editMode={true}
                    closeModal={setShowEditModal}
                    bug={bug}
                    submit={fetchData}
                />
              }
            </>
          )
        }
      </Spin>
    </LeftPanelContainer>
      </>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  loginUrl: state.work.loginUrl,
  registerUrl: state.work.registerUrl,
});

export default connect(
  mapStateToProps,
  null
)(Bug);
