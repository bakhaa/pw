import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import PasswordField from '../../components/ui/Fields/PasswordField';

const Wrap = styled.div`
  width: 100%;
  background-color: #034ca6;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 700px;
`;

const Top = styled.div`
  margin-bottom: 55px;
  text-align: center;
`;

const Form = styled.div`
  background-color: #ffffff;
  width: 400px;
  height: 390px;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Error = styled(Typography)`
  text-align: center;
  color: #f44336;
`;

const Bottom = styled.div`
  margin-top: 55px;
  height: 20px;
`;

const fieldStyle = { width: 300, height: 50, marginBottom: 20 };

class RegisterPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { showPassword: false, showRePassword: false };

    this.onChangeShowPassword = this.onChangeShowPassword.bind(this);
  }

  onChangeShowPassword(type) {
    this.setState({ [type]: !this.state[type] }); // eslint-disable-line
  }

  render() {
    const {
      values,
      handleChange,
      handleSubmit,
      handleBlur,
      isSubmitting,
      errors,
      touched,
      status,
    } = this.props;
    const { showPassword, showRePassword } = this.state;

    return (
      <Wrap>
        <Top>
          <Typography style={{ color: '#fff', fontSize: 40, fontWeight: 'bold' }}>PW</Typography>
          <Typography style={{ color: '#fff', fontSize: 25 }}>Sign up to continue to PW</Typography>
        </Top>
        <Form>
          <TextField
            style={fieldStyle}
            value={values.email}
            name="email"
            placeholder="Enter email"
            error={errors.email && (touched.email || (status && status.submitted))}
            margin="normal"
            variant="outlined"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && (touched.email || (status && status.submitted)) && (
            <Error style={{ color: '#f44336', marginTop: -10, marginBottom: 10 }}>
              {errors.email}
            </Error>
          )}
          <PasswordField
            value={values.password}
            showPassword={showPassword}
            name="password"
            placeholder="Enter password"
            error={errors.password && (touched.password || (status && status.submitted))}
            onChange={handleChange}
            onBlur={handleBlur}
            onChangeShowPassword={() => this.onChangeShowPassword('showPassword')}
          />
          {errors.password && (touched.password || (status && status.submitted)) && (
            <Error style={{ color: '#f44336', marginTop: -10, marginBottom: 10 }}>
              {errors.password}
            </Error>
          )}
          <PasswordField
            value={values.rePassword}
            showPassword={showRePassword}
            name="rePassword"
            placeholder="Confirm password"
            error={errors.rePassword && (touched.rePassword || (status && status.submitted))}
            onChange={handleChange}
            onBlur={handleBlur}
            onChangeShowPassword={() => this.onChangeShowPassword('showRePassword')}
          />
          {errors.rePassword && (touched.rePassword || (status && status.submitted)) && (
            <Error style={{ color: '#f44336', marginTop: -10, marginBottom: 10 }}>
              {errors.rePassword}
            </Error>
          )}
          <Button
            variant="contained"
            style={{ width: 300, height: 50, marginTop: 16 }}
            color="primary"
            onClick={handleSubmit}
            disabled={
              isSubmitting
              || !!(errors.email || errors.password || errors.rePassword)
              || (!values.email.length || !values.password.length || !values.rePassword.length)
            }
          >
            {isSubmitting ? <CircularProgress style={{ width: 30, height: 30 }} /> : 'Continue'}
          </Button>
        </Form>
        <Bottom>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Typography style={{ color: '#fff', fontSize: 19 }}>Log in for an account</Typography>
          </Link>
        </Bottom>
      </Wrap>
    );
  }
}

const registerMutation = gql`
  mutation($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      ok
      errors {
        message
        path
      }
    }
  }
`;

RegisterPage.propTypes = {
  values: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  errors: PropTypes.any,
  status: PropTypes.any,
};

export default compose(
  graphql(registerMutation),
  withFormik({
    mapPropsToValues: () => ({ email: '', password: '', rePassword: '' }),
    handleSubmit: async (
      values,
      { props: { history, mutate }, setSubmitting, setStatus, resetForm, setErrors },
    ) => {
      const response = await mutate({
        variables: {
          email: values.email,
          password: values.password,
        },
      });
      const {
        data: {
          register: { errors, ok },
        },
      } = response;

      if (ok) {
        history.push('/login');
        return;
      }

      resetForm({ email: values.email, password: '', rePassword: '' });
      setSubmitting(false);
      setErrors({ [errors[0].path]: errors[0].message });
      setStatus({ submitted: true });
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .min(5, 'Your password must be at least 5 characters long')
        .max(25, 'Your passwords must be 25 characters or less')
        .required('Password is required'),
      rePassword: Yup.string()
        .oneOf([Yup.ref('password'), null], "Passwords don't match")
        .required('Confirm password is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    }),
  }),
)(RegisterPage);
