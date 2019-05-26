import React from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Query, Subscription } from 'react-apollo';
import Transaction from './Transaction';

const Wrap = styled.section`
  margin: 0 auto;
  display: flex;
  width: 500px;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  flex-direction: column;
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

const Transactions = () => (
  <Wrap>
    <Subscription subscription={NEW_TRANSACTION}>
      {({ loading, data }) => {
        if (loading || !data) return null;
        return <Transaction data={data.newTransaction} />;
      }}
    </Subscription>
    <Query query={GET_TRANSACTIONS}>
      {({ loading, data }) => {
        if (loading) {
          const fakeData = new Array(7).fill('');
          return fakeData.map((item, idx) => <Transaction key={idx} />);
        }
        return data.getTransactions.transactions.map(item => (
          <Transaction key={item._id} data={item} />
        ));
      }}
    </Query>
  </Wrap>
);

export default Transactions;
