import React, { PureComponent } from 'react';
import { withApollo, Mutation, Subscription } from 'react-apollo';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import LogoutIcon from '@material-ui/icons/ExitToApp';

import { LOGOUT, CHANGE_BALANCE } from '../../graphQl/user';

const Wrap = styled.header`
  height: 80px;
  background: #e8eaeb;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 50px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logout = styled.div`
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Balance = styled.div`
  justify-content: center;
`;

class UserInfo extends PureComponent {
  render() {
    const { me, history } = this.props;

    return (
      <Wrap>
        <Info>
          <Typography>{me.email}</Typography>
          <Subscription subscription={CHANGE_BALANCE}>
            {({ data }) => {
              const balance = data && data.changeBalance ? data.changeBalance.balance : me.balance;
              return (
                <Balance>
                  <Typography>Balance: {balance}</Typography>
                </Balance>
              );
            }}
          </Subscription>
        </Info>
        <Logout>
          <Mutation mutation={LOGOUT}>
            {logout => (
              <IconButton
                onClick={() => {
                  logout();
                  window.location.reload();
                }}
              >
                <LogoutIcon />
              </IconButton>
            )}
          </Mutation>
        </Logout>
      </Wrap>
    );
  }
}

UserInfo.propTypes = {
  me: PropTypes.any,
  history: PropTypes.any,
};

export default withRouter(withApollo(UserInfo));
