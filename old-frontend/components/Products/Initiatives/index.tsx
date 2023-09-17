import React from 'react';
import { withRouter, RouteComponentProps, Switch, Route } from 'react-router-dom';
import InitiativeList from './InitiativeList';
import InitiativeDetail from './InitiativeDetail';

const Initiatives: React.SFC<RouteComponentProps> = ({ match }) => {
  return (
    <Switch>
      <Route exact default path={`${match.url}`} component={InitiativeList} />
      <Route exact path={`${match.url}/:initiativeId`} component={InitiativeDetail} />
    </Switch>
  )
};

export default withRouter(Initiatives);
