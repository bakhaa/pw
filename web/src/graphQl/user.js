import gql from 'graphql-tag';

const GET_USERS = gql`
  query($search: String!) {
    getUsers(search: $search) {
      users {
        _id
        username
      }
    }
  }
`;

const CHANGE_BALANCE = gql`
  subscription {
    changeBalance {
      userId
      balance
    }
  }
`;

const LOGOUT = gql`
  mutation {
    logout {
      ok
    }
  }
`;

export { GET_USERS, CHANGE_BALANCE, LOGOUT };
