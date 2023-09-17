import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, matchPath} from 'react-router';
import {withRouter, Link} from 'react-router-dom';
import {Row, Col, message, Button} from 'antd';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {GET_INITIATIVE_BY_ID} from 'graphql/queries';
import {DELETE_INITIATIVE} from 'graphql/mutations';
import DeleteModal from 'pages/Products/DeleteModal';
import AddInitiative from 'pages/Products/AddInitiative';
import {TaskTable, DynamicHtml} from 'components';
import EditIcon from 'components/EditIcon';
import {getProp} from 'utilities/filters';
import {getUserRole, hasManagerRoots, randomKeys} from 'utilities/utils';
import Loading from "../../Loading";
import showUnAuthModal from "../../UnAuthModal";

type Params = {
  productSlug?: any;
  initiativeId?: any;
  user: any;
  currentProduct: any;
  loginUrl: string;
  registerUrl: string;
} & RouteComponentProps;

const InitiativeDetail: React.FunctionComponent<Params> = ({user, currentProduct, loginUrl, registerUrl, params}) => {
  const {data: original, error, loading, refetch} = useQuery(GET_INITIATIVE_BY_ID, {
    variables: {id: params.params.initiativeId}
  });
  const userHasManagerRoots = hasManagerRoots(getUserRole(user.roles, params.params.productSlug));
  const [initiative, setInitiative] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [deleteInitiative] = useMutation(DELETE_INITIATIVE, {
    variables: {
      id: params.params.initiativeId
    },
    onCompleted() {
      message.success("Item is successfully deleted!").then();
      history.push(`/${params.params.personSlug}/${params.params.productSlug}/initiatives`);
    },
    onError(e) {
      if(e.message === "The person is undefined, please login to perform this action") {
        showUnAuthModal("perform this action", loginUrl, registerUrl, true);
      } else {      
        message.error("Failed to delete item!").then();
      }
    }
  });

  const fetchData = async () => {
    const data: any = await refetch({
      id: params.params.initiativeId
    });

    if (!data.errors) {
      setInitiative(data.data.initiative);
    }
  }

  useEffect(() => {
    if (original) {
      setInitiative(original.initiative);
    }
  }, [original]);

  if (loading) return <Loading/>

  return (
    <>
      {
        !error && (
          <React.Fragment key={randomKeys()}>
            <div className="text-grey">
              {
                <>
                  <Link
                    to={`/${params.params.personSlug}/${params.params.productSlug}`}
                    className="text-grey"
                  >
                    {getProp(currentProduct, 'name', '')}
                  </Link>
                  <span> / </span>
                  <Link
                    to={`/${params.params.personSlug}/${params.params.productSlug}/initiatives`}
                    className="text-grey"
                  >
                    Initiatives
                  </Link>
                  <span> / </span>
                </>
              }
              <span>{getProp(initiative, 'name', '')}</span>
            </div>
            <Row
              justify="space-between"
              className="right-panel-headline mb-15"
            >
              <div className="page-title">
                {getProp(initiative, 'name', '')}
              </div>
              {userHasManagerRoots && (
                <Col>
                  <Button
                    onClick={() => showDeleteModal(true)}
                  >
                    Delete
                  </Button>
                  <EditIcon
                    className='ml-10'
                    onClick={() => setShowEditModal(true)}
                  />
                </Col>
              )}
            </Row>
            <Row>
              <Col span={10} className='ml-10'>
                <DynamicHtml
                  className='mb-10'
                  text={getProp(initiative, 'description', '')}
                />
              </Col>
            </Row>
            <TaskTable
              tasks={getProp(initiative, 'taskSet', [])}
              productSlug={params.params.productSlug}
            />
            {deleteModal && (
              <DeleteModal
                modal={deleteModal}
                productSlug={params.params.productSlug}
                closeModal={() => showDeleteModal(false)}
                submit={deleteInitiative}
                title="Delete initiative"
              />
            )}
            {
              showEditModal && <AddInitiative
                  modal={showEditModal}
                  productSlug={params.params.productSlug}
                  modalType={true}
                  closeModal={setShowEditModal}
                  submit={fetchData}
                  initiative={initiative}
              />
            }
          </React.Fragment>
        )
      }
    </>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  currentProduct: state.work.currentProduct,
  loginUrl: state.work.loginUrl,
  registerUrl: state.work.registerUrl,
});

const mapDispatchToProps = () => ({});

const InitiativeDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InitiativeDetail);

export default withRouter(InitiativeDetailContainer);
