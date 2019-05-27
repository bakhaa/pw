import gql from 'graphql-tag';

const CREATE_TRANSACTION = gql`
  mutation($username: String!, $amount: Int!) {
    createTransaction(username: $username, amount: $amount) {
      error {
        message
      }
      ok
      transaction {
        amount
        balance
        username
        created
        _id
      }
    }
  }
`;

const GET_TRANSACTIONS = gql`
  query {
    getTransactions {
      transactions {
        amount
        username
        created
        balance
        _id
      }
    }
  }
`;

const NEW_TRANSACTION = gql`
  subscription {
    newTransaction {
      _id
      amount
      username
      created
      balance
    }
  }
`;

export { CREATE_TRANSACTION, GET_TRANSACTIONS, NEW_TRANSACTION };
