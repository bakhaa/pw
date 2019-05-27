import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { withFormik } from 'formik';
import { withSnackbar } from 'notistack';
import styled from 'styled-components';
import * as Yup from 'yup';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { CREATE_TRANSACTION, GET_TRANSACTIONS } from '../../graphQl/transactions';

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 10px;
  height: 80px;
`;

const Top = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
`;

const CreateTransaction = ({
  values,
  handleChange,
  handleSubmit,
  isSubmitting,
  touched,
  errors,
  status,
  handleBlur,
  setSearch,
  search,
  setFieldValue,
}) => {
  useEffect(() => {
    if (search.length) setFieldValue('username', search);
  }, [search]);

  return (
    <Wrap>
      <Top>
        <TextField
          style={{ width: 200, height: 40, marginTop: 0 }}
          id="outlined-bare"
          value={values.username}
          name="username"
          placeholder="Enter Username"
          error={errors.username && (touched.username || (status && status.submitted))}
          margin="normal"
          variant="outlined"
          onChange={e => {
            handleChange(e);
            setSearch(e.target.value);
          }}
          onBlur={handleBlur}
        />
        <TextField
          style={{ width: 300, height: 40, marginTop: 0, marginLeft: 5 }}
          id="outlined-bare"
          value={values.amount}
          name="amount"
          error={errors.amount && (touched.amount || (status && status.submitted))}
          placeholder="Enter amount"
          margin="normal"
          variant="outlined"
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Button
          variant="outlined"
          disabled={
            isSubmitting
            || !!(errors.username || errors.amount)
            || !(values.username.length && values.amount.length)
          }
          style={{ height: 40, marginLeft: 10, marginRight: 10 }}
          color="primary"
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Submitting...' : 'Create'}
        </Button>
      </Top>
    </Wrap>
  );
};

CreateTransaction.propTypes = {
  values: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  status: PropTypes.any,
  handleBlur: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
};

export default compose(
  graphql(CREATE_TRANSACTION),
  withSnackbar,
  withFormik({
    mapPropsToValues: () => ({ username: '', amount: '' }),
    handleSubmit: async (
      values,
      { props: { mutate, enqueueSnackbar, search, setSearch }, setSubmitting, setStatus, resetForm },
    ) => {
      await mutate({
        variables: {
          username: search || values.username,
          amount: parseInt(values.amount, 10),
        },
        update: (store, { data: { createTransaction } }) => {
          const { ok, transaction, error } = createTransaction;
          if (!ok || error) {
            enqueueSnackbar(`Error creare transaction: ${error.message}`, { variant: 'error' });
            setSubmitting(false);
            return null;
          }

          const data = store.readQuery({
            query: GET_TRANSACTIONS,
          });
          data.getTransactions.transactions.unshift(transaction);
          store.writeQuery({ query: GET_TRANSACTIONS, data });

          enqueueSnackbar(
            `New transaction ${transaction.amount} PW to ${transaction.username} created`,
            {
              variant: 'success',
            },
          );

          setSearch('');
          resetForm();
          setStatus({ submitted: true });
          setSubmitting(false);
        },
      });
    },
    validationSchema: Yup.object().shape({
      amount: Yup.number().required('Amount is required'),
      username: Yup.string().required('Username is required'),
    }),
  }),
)(CreateTransaction);
