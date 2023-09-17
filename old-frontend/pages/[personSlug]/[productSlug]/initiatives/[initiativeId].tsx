import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Row, Col, message, Button} from 'antd';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {GET_INITIATIVE_BY_ID} from '../../../../graphql/queries';
import {DELETE_INITIATIVE} from '../../../../graphql/mutations';
import DeleteModal from '../../../../components/Products/DeleteModal';
import AddInitiative from '../../../../components/Products/AddInitiative';
import {TaskTable, DynamicHtml} from '../../../../components';
import {getProp} from '../../../../utilities/filters';
import {getUserRole, hasManagerRoots, randomKeys} from '../../../../utilities/utils';
import LeftPanelContainer from '../../../../components/HOC/withLeftPanel';
import Loading from "../../../../components/Loading";
import {TASK_TYPES} from "../../../../graphql/types";
import FilterModal from "../../../../components/FilterModal";
import { FilterOutlined, EditOutlined } from "@ant-design/icons";
import AvatarIcon from "../../../../components/AvatarIcon";
// @ts-ignore
import CheckCircle from "../../../../public/assets/icons/check-circle.svg";
// @ts-ignore
import FilledCircle from "../../../../public/assets/icons/filled-circle.svg";
import VideoPlayer from "../../../../components/VideoPlayer";
import AddTask from "../../../../components/Products/AddTask";
import Head from "next/head";
import showUnAuthModal from "../../../../components/UnAuthModal";


type Params = {
  user: any;
  loginUrl: string;
  registerUrl: string;
};

const InitiativeDetail: React.FunctionComponent<Params> = ({user, loginUrl, registerUrl}) => {
  const router = useRouter();
  let {initiativeId, productSlug} = router.query;
  productSlug = String(productSlug);

  const userHasManagerRoots = hasManagerRoots(getUserRole(user.roles, productSlug));

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [initiative, setInitiative] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [inputData, setInputData] = useState({
    sortedBy: "priority",
    statuses: [2],
    tags: [],
    priority: [],
    categories: [],
    assignee: [],
    taskCreator: [],
  });

  const [deleteInitiative] = useMutation(DELETE_INITIATIVE, {
    variables: {
      id: initiativeId
    },
    onCompleted() {
      message.success("Item is successfully deleted!").then();
      router.push(`/${getProp(initiative, 'product.owner')}/${productSlug}/initiatives`).then();
    },
    onError(e) {
      if(e.message === "The person is undefined, please login to perform this action") {
        showUnAuthModal("perform this action", loginUrl, registerUrl, true);
      } else {      
        message.error("Failed to delete item").then();
      }
    }
  });

  const {data: original, error, loading, refetch} = useQuery(GET_INITIATIVE_BY_ID, {
    variables: {id: initiativeId, input: inputData }
  });

  const fetchData = () => {
    refetch({
      id: initiativeId
    });
  }

  const fetchTasks = async () => {
    await refetch(productsVariable);
  }

  const productsVariable = {
    productSlug,
    input: inputData
  };

   const closeTaskModal = (flag: boolean) => {
    setShowAddTaskModal(flag);
    refetch(productsVariable);
  };

  useEffect(() => {
    if (original && original.initiative) {
      setInitiative(original.initiative.initiative);
      setTasks(original.initiative.tasks);
    }
  }, [original]);

  const applyFilter = (values: any) => {
    values = Object.assign(values, {});
    setInputData(values);
    setFilterModal(false);
  };

  if (loading) return <Loading/>

  const status = (getProp(initiative, 'status', 1) == 1) ? "Active" : "Completed";

  const videoLink = getProp(initiative, 'previewVideoUrl', null);

  return (
      <>

        <Head>
          <title>{getProp(initiative, 'name', 'Initiative')}</title>
          {/* `${getProp(initiative, "name", "")} - ${getProp(initiative, "description", "")}` => "Initiative name - Initiative description" */}
          <meta name="description" content={ `${getProp(initiative, "name", "")} - ${getProp(initiative, "description", "")}` } />
        </Head>
    <LeftPanelContainer>
      {
        !error && (
          <React.Fragment key={randomKeys()}>
            <div className="text-grey">
              <Link href={`/${getProp(initiative, 'product.owner')}/${productSlug}`}>
                <a className="text-grey">{getProp(initiative, 'product.name', '')}</a>
              </Link>
              <span> / </span>
              <Link href={`/${getProp(initiative, 'product.owner')}/${productSlug}/initiatives`}>
                <a className="text-grey">Initiatives</a>
              </Link>
            </div>
            <Row
              justify="space-between"
              className="right-panel-headline mb-15"
            >
              <div className="page-title page-title-flex">
                <div>
                  {getProp(initiative, 'name', '')}
                  {userHasManagerRoots && (
                    <>
                      <AvatarIcon
                        className="ml-10 small-avatar"
                        icon={<EditOutlined />}
                        onClick={() => setShowEditModal(true)}
                      />
                    </>
                  )}
                </div>
                <div className="instance-status">
                  {status}
                  <img
                    src={status === "Active" ? FilledCircle : CheckCircle}
                    className="check-circle-icon ml-5"
                    alt="status"
                  />
                </div>
              </div>
            </Row>
            <Row className="html-description">
              {videoLink && <div className="pb-15"><VideoPlayer videoLink={videoLink} /></div> }
              <Col span={24}>
                <DynamicHtml
                  className='mb-10'
                  text={getProp(initiative, 'description', '')}
                />
              </Col>
            </Row>

            <TaskTable
              tasks={tasks}
              statusList={TASK_TYPES}
              productSlug={productSlug}
              content={<Col md={8} className="text-right">
                              <Button type="primary"
                               style={{padding: "0 10px"}}
                               onClick={() => setFilterModal(!filterModal)}
                               icon={<FilterOutlined />}>Filter</Button>

                                {userHasManagerRoots && (<><Button
                                className="text-right add-task-btn mb-15 ml-15"
                                onClick={() => setShowAddTaskModal(true)}
                                >Add Task</Button>

                                <AddTask
                                    modal={showAddTaskModal}
                                    closeModal={closeTaskModal}
                                    tasks={tasks}
                                    initiativeID={initiativeId}
                                    submit={fetchTasks}
                                    productSlug={String(productSlug)}
                                  /></>)}

                                </Col>}
                                submit={fetchData}
                              />
            {deleteModal && (
              <DeleteModal
                modal={deleteModal}
                closeModal={() => showDeleteModal(false)}
                submit={() => {
                  showDeleteModal(false);
                  deleteInitiative().then()
                }}
                title="Delete this initiative"
                description="Are you sure you want to delete this initiative?"
              />
            )}
            {
              showEditModal && <AddInitiative
                modal={showEditModal}
                productSlug={productSlug}
                modalType={true}
                closeModal={setShowEditModal}
                submit={fetchData}
                handleDelete={() => {
                  setShowEditModal(false);
                  showDeleteModal(true);
                }}
                initiative={initiative}
              />
            }
            <FilterModal
              modal={filterModal}
              initialForm={inputData}
              closeModal={() => setFilterModal(false)}
              productSlug={productSlug}
              submit={applyFilter}
            />
          </React.Fragment>
        )
      }
    </LeftPanelContainer>
      </>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  userRole: state.work.userRole,
  loginUrl: state.work.loginUrl,
  registerUrl: state.work.registerUrl,
});

const mapDispatchToProps = () => ({});

const InitiativeDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InitiativeDetail);

export default InitiativeDetailContainer;
