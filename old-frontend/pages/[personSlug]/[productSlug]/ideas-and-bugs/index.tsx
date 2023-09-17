import React, {useState} from 'react';
import {Col, Radio, Row, Typography, Button, Empty, Spin} from 'antd';
import {useQuery, useLazyQuery} from '@apollo/react-hooks';
import {connect} from 'react-redux';
import parse from "html-react-parser";
import {GET_PRODUCT_IDEAS, GET_PRODUCT_BUGS, GET_LOGGED_IN_USER} from '../../../../graphql/queries';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';
import {RadioChangeEvent} from "antd/es";
import Link from "next/link";
import Loading from "../../../../components/Loading";
import {useRouter} from "next/router";
import CustomAvatar2 from "../../../../components/CustomAvatar2";
import AddEditBug from "../../../../components/AddEditBug";
import AddEditIdea from "../../../../components/AddEditIdea";
import showUnAuthModal from "../../../../components/UnAuthModal";
import Head from "next/head";

type Props = {
  user: { isLoggedIn: boolean, id: string },
  loginUrl: string,
  registerUrl: string
};

const ItemList = (items: any, itemType: string, personSlug: string, productSlug: string, user: {id: string}) => {
  return (
    <>
      {items.length > 0 ? items.map((item: any, index: number) => {
        const {person, relatedCapability} = item;
        const assignPersonSlug = person.slug;
        return (
          <div key={`person-${index}`} className="product-list-item">
            <Row>
              <Col xs={24}>
                <Row wrap={false}>
                  <Col span={16}>
                    <div style={{paddingLeft: 10}}>
                      <Row>
                        <Link
                          href={`/${personSlug}/${productSlug}/${itemType}/${item.id}`}
                        >
                          <a className="text-grey-9">
                            <strong>
                              <Row align="middle">
                                {item.headline}
                              </Row>
                            </strong>
                          </a>
                        </Link>
                      </Row>
                      <Row>
                        <Col>
                          <Typography.Text
                            type="secondary"
                            style={{marginBottom: 5}}
                          >{parse(item.description)}</Typography.Text>
                        </Col>
                      </Row>
                      {relatedCapability && (
                        <Row align="middle" style={{marginTop: 10}}>

                          <Link href={`/${personSlug}/${productSlug}/capabilities/${relatedCapability.id}`}>
                            <span className="text-grey-9 pointer link">
                              {relatedCapability.name}
                            </span>
                          </Link>
                        </Row>
                      )}
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="mt-10">
                      <div className="d-flex-end" style={{fontSize: 13}}>
                        {user.id === person.id ? <strong>Created by You</strong> : (
                          <>
                            <CustomAvatar2 person={{firstName: person.firstName, slug: assignPersonSlug}}
                                           size={35} />
                            <Link href={`/${assignPersonSlug}`}>
                              {person.firstName}
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-10">
                      <div className="d-flex-end" style={{fontSize: 13}}>
                        Votes: {item.voteUp}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        )
      }) : <Empty style={{ margin: "20px auto"}} description={`The ${itemType} list is empty`} />}
    </>
  )
}


const IdeasAndBugs: React.FunctionComponent<Props> = (props: Props) => {
  const router = useRouter();
  const {productSlug, personSlug} = router.query;
  const {user, loginUrl, registerUrl} = props;
  const [mode, setMode] = useState("idea");
  const [showIdeaAddModal, setIdeaShowAddModal] = useState(false);
  const [showBugAddModal, setBugShowAddModal] = useState(false);
  const {data: ideas, loading: ideasLoading, refetch: refetchIdeas} = useQuery(GET_PRODUCT_IDEAS, {
    variables: {productSlug},
    fetchPolicy: "no-cache"
  });

  const {data: bugs, loading: bugsLoading, refetch: refetchBugs} = useQuery(GET_PRODUCT_BUGS, {
    variables: {productSlug},
    fetchPolicy: "no-cache"
  });

  const ideaMode = mode === "idea";

  const  [checkLoggedInUser, { data: loggedInUser, loading: checkLoggedInUserLoading }] = useLazyQuery(GET_LOGGED_IN_USER, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    onCompleted() {
      ideaMode ? setIdeaShowAddModal(true) : setBugShowAddModal(true);
    },
    onError(e) {
        if(e.message === "The person is undefined, please login to perform this action") {
            showUnAuthModal(`Create a new ${mode}`, loginUrl, registerUrl, true);
        }
    },

  });

  const addAction = () => {
    checkLoggedInUser();
    // if (user.isLoggedIn) {
    //   ideaMode ? setIdeaShowAddModal(true) : setBugShowAddModal(true);
    // } else {
    //   showUnAuthModal(`Create a new ${mode}`, loginUrl, registerUrl);
    // }
  };

  if (ideasLoading || bugsLoading) return <Loading/>;

  return (
      <>
        <Head>
          <title>Ideas & Bugs</title>
          <meta name="description" content="Ideas & Bugs" />
        </Head>
    <LeftPanelContainer>
      <Spin
            tip="Loading..."
            spinning={checkLoggedInUserLoading}
            delay={200}
        >
        <div className="mb-15 d-flex-justify">
          <Radio.Group
            onChange={(e: RadioChangeEvent) => setMode(e.target.value)}
            value={mode}
            style={{marginBottom: 20}}
          >
            <Radio.Button value="idea"
                          style={{borderRadius: "5px 0 0 5px"}}>Ideas</Radio.Button>
            <Radio.Button value="bug"
                          style={{borderRadius: "0 5px 5px 0"}}>Bugs</Radio.Button>
          </Radio.Group>
          <Button
            className="text-right add-task-btn"
            style={{marginLeft: "auto"}}
            onClick={() => addAction()}
          >
            Add {ideaMode ? "Idea" : "Bug"}
          </Button>
        </div>
        <>
          {ideaMode
            ? ItemList(ideas?.ideas || [], "ideas", personSlug, productSlug, user)
            : ItemList(bugs?.bugs || [], "bugs", personSlug, productSlug, user)
          }
        </>
        {showBugAddModal &&
          <AddEditBug
              modal={showBugAddModal}
              productSlug={productSlug}
              closeModal={setBugShowAddModal}
              submit={refetchBugs}
          />
        }
        {showIdeaAddModal &&
          <AddEditIdea
              modal={showIdeaAddModal}
              productSlug={productSlug}
              closeModal={setIdeaShowAddModal}
              submit={refetchIdeas}
          />
        }
      </Spin>
    </LeftPanelContainer>
        </>
  );
}

const mapStateToProps = (state: any) => ({
  user: state.user,
  loginUrl: state.work.loginUrl,
  registerUrl: state.work.registerUrl
});

export default connect(mapStateToProps, null)(IdeasAndBugs);
