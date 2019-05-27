import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { withSnackbar } from 'notistack';

import Transaction from './Transaction';

import { NEW_TRANSACTION, GET_TRANSACTIONS } from '../../graphQl/transactions';

const Wrap = styled.section`
  display: flex;
  width: 70%;
  justify-content: center;
  align-items: flex-start;
  padding: 20px 0;
  flex-direction: column;
`;

class Transactions extends PureComponent {
  _subscribeToNewTransactions(subscribeToMore) {
    const { enqueueSnackbar } = this.props;
    subscribeToMore({
      document: NEW_TRANSACTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const { newTransaction } = subscriptionData.data;
        const exists = prev.getTransactions.transactions.find(
          ({ _id }) => _id === newTransaction._id,
        );
        if (exists) return prev;

        enqueueSnackbar(
          `New transaction ${newTransaction.amount} PW from ${newTransaction.username}`,
        );

        return Object.assign({}, prev, {
          getTransactions: {
            transactions: [newTransaction, ...prev.getTransactions.transactions],
            __typename: 'transactionsResponse',
          },
        });
      },
    });
  }

  render() {
    return (
      <Wrap>
        <Query query={GET_TRANSACTIONS}>
          {({ loading, error, data, subscribeToMore }) => {
            if (loading || error) {
              const fakeData = new Array(7).fill('');
              return fakeData.map((item, idx) => <Transaction key={idx} />);
            }

            this._subscribeToNewTransactions(subscribeToMore);

            return data.getTransactions.transactions.map(item => (
              <Transaction key={item._id} data={item} />
            ));
          }}
        </Query>
      </Wrap>
    );
  }
}

Transactions.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default withSnackbar(Transactions);
