import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { withSnackbar } from 'notistack';

import { Typography } from '@material-ui/core';
import { GET_USERS } from '../../graphQl/user';
import User from './User';

const Wrap = styled.section`
  display: flex;
  width: 30%;
  align-items: center;
  padding: 20px 0;
  flex-direction: column;
`;

const Users = ({ search, setSearch }) => (
  <Wrap>
    <Query query={GET_USERS} variables={{ search }}>
      {({ loading, error, data }) => {
        if (loading || error) {
          const fakeData = new Array(7).fill('');
          return fakeData.map((item, idx) => <User key={idx} />);
        }

        if (!data.getUsers.users.length) return <Typography>Not found users.</Typography>;

        return data.getUsers.users.map(user => (
          <User setSearch={setSearch} key={user._id} search={search} data={user} />
        ));
      }}
    </Query>
  </Wrap>
);

Users.propTypes = {
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
};

export default withSnackbar(Users);
