import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Col, Button, Spin} from 'antd';
import {useRouter} from 'next/router'
import {useQuery, useLazyQuery} from '@apollo/react-hooks';
import {GET_INITIATIVES, GET_LOGGED_IN_USER} from '../../../../graphql/queries';
import {getUserRole, hasManagerRoots, randomKeys} from '../../../../utilities/utils';
import AddInitiative from '../../../../components/Products/AddInitiative';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';
// @ts-ignore
import CheckCircle from "../../../../public/assets/icons/check-circle.svg";
import InitiativeTable from "../../../../components/InitiativeTable";
import {FilterOutlined} from "@ant-design/icons";
import InitiativeFilterModal from "../../../../components/InitiativeFilterModal";
import Loading from "../../../../components/Loading";
import Head from "next/head";
import showUnAuthModal from "../../../../components/UnAuthModal";


type Params = {
  user: any,
  loginUrl: string,
  registerUrl: string
};

const InitiativeList: React.FunctionComponent<Params> = ({user, loginUrl, registerUrl}) => {
  const router = useRouter();
  const [filterModal, setFilterModal] = useState(false);
  let {productSlug, personSlug} = router.query;
  productSlug = String(productSlug);
  const [inputData, setInputData] = useState({
    statuses: [1],
    categories: [],
    tags: [],
  });
  const initialQueryVariables = {productSlug, input: inputData};
  const userHasManagerRoots = hasManagerRoots(getUserRole(user.roles, productSlug));

  const [showEditModal, setShowEditModal] = useState(false);
  const {data, error, loading, refetch} = useQuery(GET_INITIATIVES, {
    variables: initialQueryVariables,
    fetchPolicy: "no-cache"
  });

  const applyFilter = (values: any) => {
    values = Object.assign(values, {});
    setInputData(values);
    setFilterModal(false);
  }

  const  [checkLoggedInUser, { data: loggedInUser, loading: checkLoggedInUserLoading }] = useLazyQuery(GET_LOGGED_IN_USER, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    onCompleted() {
      setShowEditModal(!showEditModal);
    },
    onError(e) {
        if(e.message === "The person is undefined, please login to perform this action") {
            showUnAuthModal("create a new initiative", loginUrl, registerUrl, true);
        }
    },

  });

  return (
      <>
        <Head>
          <title>Initiatives</title>
          <meta name="description" content="Initiatives" />
        </Head>
    <LeftPanelContainer>
      {
        !error && (
          <React.Fragment key={randomKeys()}>
            <Spin
              tip="Loading..."
              spinning={checkLoggedInUserLoading}
              delay={200}
            >
              {loading ? <Loading /> :
                <InitiativeTable
                  initiatives={data?.initiatives ? data.initiatives : []}
                  content={<div className="d-flex-justify-center">
                    {userHasManagerRoots && (
                      <Col>
                        <Button
                          className="ml-10"
                          onClick={() => checkLoggedInUser()}
                        >
                          Add new initiative
                        </Button>
                      </Col>
                    )}
                    <Button
                      type="primary"
                      onClick={() => setFilterModal(!filterModal)}
                      icon={<FilterOutlined/>}
                    >Filter</Button>
                  </div>}
                  personSlug={personSlug}
                  productSlug={productSlug} />}
              {
                showEditModal &&
                <AddInitiative
                    modal={showEditModal}
                    productSlug={productSlug}
                    modalType={false}
                    closeModal={setShowEditModal}
                    submit={() => refetch()}
                />
              }
              <InitiativeFilterModal
                modal={filterModal}
                initialForm={inputData}
                closeModal={() => setFilterModal(false)}
                submit={applyFilter}
              />
            </Spin>
          </React.Fragment>
        )
      }
    </LeftPanelContainer>
      </>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  loginUrl: state.work.loginUrl,
  registerUrl: state.work.registerUrl,
});

const mapDispatchToProps = () => ({});

const InitiativeListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InitiativeList);

export default InitiativeListContainer;
