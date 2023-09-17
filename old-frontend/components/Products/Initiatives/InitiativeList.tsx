import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Row, Col, Card, Button} from 'antd';
import {useQuery} from '@apollo/react-hooks';
import {DynamicHtml} from '../../../components';
import {GET_INITIATIVES} from '../../../graphql/queries';
import {getUserRole, hasManagerRoots, randomKeys} from '../../../utilities/utils';
import AddInitiative from '../../../components/AddInitiative';
import {getProp} from '../../../utilities/filters';
import Loading from "../../Loading";

type Params = {
  productSlug?: any,
  userRole?: string,
  match: any,
  user: any,
};

const InitiativeList: React.FunctionComponent<Params> = ({history, location, match, user}) => {
  const params: any = matchPath(match.url, {
    path: "/products/:productSlug/initiatives",
    exact: false,
    strict: false
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [initiatives, setInitiatives] = useState([]);
  const {data, error, loading, refetch} = useQuery(GET_INITIATIVES, {
    variables: {productSlug: params.params.productSlug}
  });

  const userHasManagerRoots = hasManagerRoots(getUserRole(user.roles, params.params.productSlug));

  const goToDetails = (id: number) => {
    history.push(`${match.url}/${id}`);
  }

  const fetchData = async () => {
    const {data: newData} = await refetch({
      productSlug: params.params.productSlug
    });

    setInitiatives(newData.initiatives)
  }

  useEffect(() => {
    if (data) {
      setInitiatives(data.initiatives);
    }
  }, [data]);


  if (loading) return <Loading/>

  return (
    <>
      {
        !error && (
          <React.Fragment key={randomKeys()}>
            <Row
              justify="space-between"
              className="right-panel-headline mb-15"
            >
              <Col>
                <div className="page-title text-center">
                  {initiatives
                    ? `Explore ${initiatives.length} initiatives`
                    : 'No initiatives'
                  }
                </div>
              </Col>
              {userHasManagerRoots && (
                <Col>
                  <Button
                    onClick={() => setShowEditModal(!showEditModal)}
                  >
                    Add new initiative
                  </Button>
                </Col>
              )}
            </Row>
            <Row gutter={[16, 16]}>
              {
                initiatives && initiatives.map((initiative: any) => (
                  <Col key={randomKeys()} xs={24} sm={12} md={8}>
                    {/* <Card
                    cover={
                      <ReactPlayer
                        width="100%"
                        height="172px"
                        url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
                      />
                    }
                  > */}
                    <Card>
                      <div
                        className='pointer'
                        onClick={() => goToDetails(initiative.id)}
                      >
                        <div className='html-description'>
                          <h4 className='mt-5'>{initiative.name}</h4>
                          <DynamicHtml
                            text={getProp(initiative, 'description', '')}
                          />
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))
              }
              {
                showEditModal && <AddInitiative
                    modal={showEditModal}
                    productSlug={params.params.productSlug}
                    modalType={false}
                    closeModal={setShowEditModal}
                    submit={fetchData}
                />
              }
            </Row>
          </React.Fragment>
        )
      }
    </>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  userRole: state.work.userRole
});

const mapDispatchToProps = () => ({});

const InitiativeListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InitiativeList);

export default InitiativeListContainer;