import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps, matchPath } from 'react-router-dom';
import { Row, Col, Select, Spin, Button } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { GET_TASKS_BY_PRODUCT } from 'graphql/queries';
import { TaskTable } from 'components';
import AddTask from 'pages/Products/AddTask';
import {getUserRole, hasManagerRoots} from "../../../utilities/utils";

const { Option } = Select;


type Props = {
  onClick?: () => void;
  currentProduct: any;
  userRole: string;
} & RouteComponentProps;

const TasksPage: React.FunctionComponent<Props> = (props: Props) => {
  const { match, user } = props;
  const [tagType, setTagType] = useState("all");
  const [sortType, setSortType] = useState("initiatives");
  const [taskType, setTaskType] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const params: any = matchPath(match.url, {
    path: "/products/:productSlug/challenges",
    exact: false,
    strict: false
  });
  const { data, error, loading, refetch } = useQuery(GET_TASKS_BY_PRODUCT, {
    variables: { productSlug: params.params.productSlug }
  });

  const userHasManagerRoots = hasManagerRoots(getUserRole(user.roles, params.params.productSlug));

  const closeTaskModal = (flag: boolean) => {
    setShowAddTaskModal(flag);
    refetch({ productSlug: params.params.productSlug });
  }

  const fetchTasks = async () => {
    const { data: newData } = await refetch({
      productSlug: params.params.productSlug
    });
    setTasks(newData.tasks);
  }

  useEffect(() => {
    if (data) {
      fetchTasks();
    }
  }, [data])

  return (
    <>
      <div>
        <Row>
          {userHasManagerRoots && (
            <Col>
              <Button
                className="text-right add-task-btn mb-15"
                onClick={() => setShowAddTaskModal(true)}
              >
                Add Task
              </Button>
              <AddTask
                modal={showAddTaskModal}
                productSlug={params.params.productSlug}
                closeModal={closeTaskModal}
                tasks={tasks}
                submit={fetchTasks}
              />
            </Col>
          )}
          <Col className="tag-section ml-auto">
            <div>
            <label className='mr-15'>Tags: </label>
              <Select
                defaultValue={tagType}
                style={{ width: 120 }}
                onChange={setTagType}
              >
                <Option value="all">All</Option>
                <Option value="django">Django</Option>
                <Option value="react">React</Option>
                <Option value="graphql">Graphql</Option>
              </Select>
            </div>
            <div className='ml-15'>
              <label className='mr-15'>Sorted by: </label>
              <Select
                defaultValue={sortType}
                style={{ width: 120 }}
                onChange={setSortType}
              >
                <Option value="initiatives">Number of initiatives</Option>
                <Option value="stroies">Number of tasks</Option>
              </Select>
            </div>
            <div className='ml-15'>
              <label className='mr-15'>Tasks: </label>
              <Select
                defaultValue={taskType}
                style={{ width: 120 }}
                onChange={setTaskType}
              >
                <Option value="all">All</Option>
                <Option value="django">Django</Option>
                <Option value="react">React</Option>
                <Option value="graphql">Graphql</Option>
              </Select>
            </div>
          </Col>
        </Row>
      </div>
      <div>
        {
          loading ? (
            <Spin size="large" />
          ) : tasks ? (
            <TaskTable
              hideTitle={true}
              tasks={tasks}
              productSlug={params.params.productSlug}
              statusList={data.statusList}
              showPendingTasks={userHasManagerRoots}
            />
          ) : (
            <h3 className="text-center mt-30">No tasks</h3>
          )
        }
      </div>
    </>
  )
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  currentProduct: state.work.currentProduct,
  userRole: state.work.userRole
});

const mapDispatchToProps = (dispatch: any) => ({
});

const TasksPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TasksPage);

export default withRouter(TasksPageContainer);
