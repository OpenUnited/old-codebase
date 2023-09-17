import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Row, Col, message, Button, Spin, Typography, Breadcrumb} from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import {useRouter} from 'next/router';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {
  GET_PRODUCT_IDEA_BY_ID,
} from '../../../../graphql/queries';
import {IDEA_TYPES} from '../../../../graphql/types';
import {DELETE_IDEA, VOTE_IDEA} from '../../../../graphql/mutations';
import {getProp} from '../../../../utilities/filters';
import {EditIcon} from '../../../../components';
import DeleteModal from '../../../../components/Products/DeleteModal';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';
import parse from "html-react-parser";
import {getUserRole, hasManagerRoots} from "../../../../utilities/utils";
import CustomAvatar2 from "../../../../components/CustomAvatar2";
import AddEditIdea from "../../../../components/AddEditIdea";
import Comments from "../../../../components/Comments";
import Head from "next/head";
import showUnAuthModal from "../../../../components/UnAuthModal";

const getIdeaType = (ideaType: number) => {
  let searchedType = IDEA_TYPES.filter((t) => t.id === ideaType)
  return searchedType.length > 0 ? searchedType[0].name : ideaType
}

type Params = {
  user?: any;
  currentProduct: any;
  loginUrl: string;
  registerUrl: string;
};

const Idea: React.FunctionComponent<Params> = ({user, loginUrl, registerUrl}) => {
  const router = useRouter();
  const {ideaId, personSlug, productSlug} = router.query;

  const [deleteModal, showDeleteModal] = useState(false);
  const [idea, setIdea] = useState<any>({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [voteType, setVoteType] = useState(0);

  const {data: ideaData, error, loading, refetch} = useQuery(GET_PRODUCT_IDEA_BY_ID, {
    variables: {id: ideaId}
  });

  const userHasManagerRoots = hasManagerRoots(getUserRole(user.roles, productSlug));

  const getBasePath = () => `/${personSlug}/${productSlug}`;

  const [deleteIdea] = useMutation(DELETE_IDEA, {
    variables: {
      id: parseInt(ideaId)
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

  const [voteIdea] = useMutation(VOTE_IDEA, {
    variables: {
      input: {
        objectId: parseInt(ideaId),
        voteType
      }
    },
    onCompleted: (msg) => {
      const {success, message: voteMessage} = msg.voteIdea;
      message[success ? "success" : "error"](voteMessage).then();
      if (success) refetch();
    },
    onError: (e) => {
      if(e.message === "The person is undefined, please login to perform this action") {
        showUnAuthModal("perform this action", loginUrl, registerUrl, true);
      } else {      
        message.error(e.message).then();
      }
    }
  });

  useEffect(() => {
    if (ideaData) setIdea(ideaData?.idea || {});
  }, [ideaData]);

  return (
      <>
        <Head>
          <title>  {getProp(idea, 'headline', 'idea')}</title>
          {/* `${getProp(idea, 'product.name', '')} ${getProp(idea, 'headline', 'idea')}` => "Product name Idea headline" */}
          <meta name="description" content={`${getProp(idea, 'product.name', '')} ${getProp(idea, 'headline', 'idea')}`}/>
        </Head>
    <LeftPanelContainer>
      <Spin tip="Loading..." spinning={loading} delay={200}>
        {
          !error && (
            <>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <a href={getBasePath()}>{getProp(idea, 'product.name', '')}</a>
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
                    {getProp(idea, 'headline', '')}
                  </div>
                </Col>
                <Col md={8} className="text-right">
                  {userHasManagerRoots || getProp(idea, "person.id", undefined) === user.id && (
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
                      {parse(getProp(idea, 'description', ''))}
                    </Col>
                  </Row>
                  <div className="mt-22">
                    {/*<Row style={{marginTop: 10}} className="text-sm mt-8">*/}
                    {/*  <strong className="my-auto">Idea Type: </strong>*/}
                    {/*  &nbsp;{getIdeaType(idea.ideaType)}*/}
                    {/*</Row>*/}
                    <Row style={{marginTop: 10}} className="text-sm mt-8">
                      {idea.person?.id === user.id ? (
                        <strong className="my-auto">Created By You</strong>
                      ) : (
                        <>
                          <strong className="my-auto">Created By: </strong>
                          <Row align="middle" style={{marginLeft: 15}}>
                            <Col>
                              <CustomAvatar2 person={{
                                firstName: getProp(idea, 'person.firstName', ''),
                                slug: getProp(idea, 'person.slug', '')
                              }}/>
                            </Col>
                            <Col>
                              <Typography.Link className="text-grey-9"
                                               href={`/${getProp(idea, 'person.slug', '')}`}>
                                {getProp(idea, 'person.firstName', '')}
                              </Typography.Link>
                            </Col>
                          </Row>
                        </>
                      )}
                    </Row>

                    {
                      idea.relatedCapability && (
                        <Row className="text-sm mt-8">
                          <strong className="my-auto">
                            Related Capability:
                          </strong>
                          <Typography.Link className="ml-5"
                                           href={`${getBasePath()}/capabilities/${getProp(idea, 'relatedCapability.id')}`}>
                            {getProp(idea, 'relatedCapability.name', '')}
                          </Typography.Link>
                        </Row>
                      )
                    }

                    <Row className="text-sm mt-8">
                      <strong>Votes:</strong>&nbsp;{idea.voteUp}
                    </Row>

                    {user.isLoggedIn && user.id !== idea?.person?.id && (
                      <Row className="text-sm mt-15">
                        <Button icon={<ArrowUpOutlined />}
                                type="primary"
                                onClick={voteIdea}>Upvote</Button>
                      </Row>
                    )}

                  </div>
                </Col>
              </Row>

              <div style={{marginTop: 30}} />

              <Comments objectId={idea?.id || 0} objectType="idea" />

              {deleteModal && (
                <DeleteModal
                  modal={deleteModal}
                  closeModal={() => showDeleteModal(false)}
                  submit={deleteIdea}
                  title="Delete idea"
                  description="Are you sure you want to delete Idea?"
                />
              )}
              {
                showEditModal &&
                  <AddEditIdea
                    modal={showEditModal}
                    productSlug={productSlug}
                    editMode={true}
                    closeModal={setShowEditModal}
                    idea={idea}
                    submit={refetch}
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
  currentProduct: state.work.currentProduct || {},
  loginUrl: state.work.loginUrl,
  registerUrl: state.work.registerUrl,
});

export default connect(
  mapStateToProps,
  null
)(Idea);
