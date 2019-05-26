import React, { Component } from 'react';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';

const NEW_TRANSACTION_SUBSCRIPTION = gql`
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
const Transactions = ({ data: { newTransaction } }) => {
  console.log('newTransaction', newTransaction);
  return <div>Transactions</div>;
};

export default graphql(NEW_TRANSACTION_SUBSCRIPTION)(withApollo(Transactions));
