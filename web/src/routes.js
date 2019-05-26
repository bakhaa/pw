import * as React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import MainPage from './pages/MainPage';

const ME = gql`
  query Me {
    me {
      user {
        email
        balance
      }
    }
  }
`;

const AuthRoute = ({ component: Component, ...rest }) => (
  <Query query={ME} fetchPolicy="no-cache">
    {({ loading, data }) => {
      if (!loading && data.me.user) {
        return <Component me={data.me.user} {...rest} />;
      }
      if (!loading && !data.me.user) {
        return <Redirect to={{ pathname: '/login' }} />;
      }
      return <div>Loading...</div>;
    }}
  </Query>
);

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/register" component={RegisterPage} />
      <Route exact path="/login" component={LoginPage} />
      <AuthRoute exact path="/" component={MainPage} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
