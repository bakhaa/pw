import React from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
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

const Transactions = () => (
  <Wrap>
    <Query query={GET_TRANSACTIONS}>
      {({ loading, data, error }) => {
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
