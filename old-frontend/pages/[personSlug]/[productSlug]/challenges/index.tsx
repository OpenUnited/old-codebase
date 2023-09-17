import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Row, Col, Button, Spin} from 'antd';
import {useQuery, useLazyQuery} from '@apollo/react-hooks';
import {GET_TASKS_BY_PRODUCT, GET_LOGGED_IN_USER} from '../../../../graphql/queries';
import TaskTableTiles from '../../../../components/TaskTableTiles';
import AddTask from '../../../../components/Products/AddTask';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';
import {useRouter} from "next/router";
import {TASK_TYPES} from "../../../../graphql/types";
import Loading from "../../../../components/Loading";
import {FilterOutlined} from "@ant-design/icons";
import FilterModal from "../../../../components/FilterModal";
import {getUserRole, hasManagerRoots} from "../../../../utilities/utils";
import Head from "next/head";
import showUnAuthModal from "../../../../components/UnAuthModal";


type Props = {
  onClick?: () => void;
  userRole: string;
  user: { roles: any[], id: string },
  productSlug: string;
  loginUrl: string;
  registerUrl: string;
};

const TasksPage: React.FunctionComponent<Props> = (props: Props) => {
  const router = useRouter()
  const {productSlug} = router.query
  const {user, loginUrl, registerUrl} = props;
  const [statuses, setStatuses] = useState<Array<number>>([2]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [tasks, setTasks] = useState<any>([]);
  const [inputData, setInputData] = useState({
    sortedBy: "priority",
    statuses,
    tags: [],
    priority: [],
    categories: [],
    assignee: [],
    taskCreator: [],
  });

  useEffect(() => {
    if (location.hash === '#available') {
      setStatuses([2]);
    }
  }, []);

  const productsVariable = {
    productSlug,
    input: inputData
  };

  const {data, error, loading, refetch} = useQuery(GET_TASKS_BY_PRODUCT, {
    variables: productsVariable,
    fetchPolicy: "no-cache"
  });

  const closeTaskModal = (flag: boolean) => {
    setShowAddTaskModal(flag);
    refetch(productsVariable);
  };

  const applyFilter = (values: any) => {
    values = Object.assign(values, {});
    setInputData(values);
    setFilterModal(false);
  }

  const [checkLoggedInUser, { data: loggedInUser, loading: checkLoggedInUserLoading }] = useLazyQuery(GET_LOGGED_IN_USER, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    onCompleted() {
      setShowAddTaskModal(true);
    },
    onError(e) {
        if(e.message === "The person is undefined, please login to perform this action") {
            showUnAuthModal("perform this action", loginUrl, registerUrl, true);
        }
    },

  });

  useEffect(() => {
    if (data && data.tasklistingByProduct) {
      setTasks(data.tasklistingByProduct);
    }
  }, [data]);

  const fetchTasks = async () => {
    await refetch(productsVariable);
  }

  if (loading) return <Loading/>;

  const userHasManagerRoots = hasManagerRoots(getUserRole(user.roles, productSlug));

  const showAddTask = () => {
    checkLoggedInUser();
  }

  return (
      <>
        <Head>
          <title>Challenges</title>
          <meta name="description" content="Tasks" />
        </Head>
    <LeftPanelContainer>
      <Spin
            tip="Loading..."
            spinning={checkLoggedInUserLoading}
            delay={200}
          >
        <div>
          <Row>
            {userHasManagerRoots && (
              <Col>
                <Button
                  className="text-right add-task-btn mb-15"
                  onClick={() => { showAddTask() }}
                >
                  Add Challenge
                </Button>
                <AddTask
                  modal={showAddTaskModal}
                  closeModal={closeTaskModal}
                  tasks={tasks}
                  submit={fetchTasks}
                  productSlug={String(productSlug)}
                />
              </Col>
            )}
            <Col className="tag-section ml-auto">
              <Button
                type="primary"
                onClick={() => setFilterModal(!filterModal)}
                icon={<FilterOutlined/>}
              >Filter</Button>
            </Col>
          </Row>
        </div>
        <div className="pt-15">
          {
            !error ?
              <TaskTableTiles
                submit={() => refetch(productsVariable)}
                tasks={tasks}
                statusList={TASK_TYPES}
                showInitiativeName={true}
                showProductName={false}
                gridSizeLg={8}
                gridSizeMd={12}
                gridSizeSm={24}
                pagesize={36}
              /> : (
                <h3 className="text-center mt-30">No tasks</h3>
              )
          }
        </div>
      </Spin>


      <FilterModal
        modal={filterModal}
        initialForm={inputData}
        closeModal={() => setFilterModal(false)}
        productSlug={productSlug}
        submit={applyFilter}
      />

    </LeftPanelContainer>
      </>
  )
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  loginUrl: state.work.loginUrl,
  registerUrl: state.work.registerUrl,
});

const mapDispatchToProps = () => ({});

const TasksPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TasksPage);

export default TasksPageContainer;
