import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { withFormik } from 'formik';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
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
  padding-bottom: 10px;
`;

const Bottom = styled.div`
  margin-top: 55px;
  height: 20px;
`;

const fieldStyle = { width: 300, height: 50, marginBottom: 20 };

class LoginPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { showPassword: false };

    this.onChangeShowPassword = this.onChangeShowPassword.bind(this);
  }

  onChangeShowPassword() {
    const { showPassword } = this.state;
    this.setState({ showPassword: !showPassword });
  }

  render() {
    const { values, handleChange, handleSubmit, isSubmitting, errors } = this.props;
    const { showPassword } = this.state;
    return (
      <Wrap>
        <Top>
          <Typography style={{ color: '#fff', fontSize: 40, fontWeight: 'bold' }}>PW</Typography>
          <Typography style={{ color: '#fff', fontSize: 25 }}>Log in to continue to PW</Typography>
        </Top>
        <FormControl component="fieldset">
          <Form>
            <TextField
              style={fieldStyle}
              value={values.email}
              name="email"
              placeholder="Enter email"
              margin="normal"
              variant="outlined"
              onChange={handleChange}
            />
            <PasswordField
              value={values.password}
              showPassword={showPassword}
              name="password"
              placeholder="Enter password"
              error={false}
              onChange={handleChange}
              // onBlur={handleBlur}
              onChangeShowPassword={this.onChangeShowPassword}
            />

            {errors.length
              && errors.map((err, idx) => (
                <Error style={{ color: '#f44336' }} key={idx}>
                  {Object.values(err)[0]}
                </Error>
              ))}
            <Button
              variant="contained"
              style={{ width: 300, height: 50, marginTop: 16 }}
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitting || (!values.email.length || !values.password.length)}
            >
              {isSubmitting ? <CircularProgress style={{ width: 30, height: 30 }} /> : 'Continue'}
            </Button>
          </Form>
        </FormControl>
        <Bottom>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <Typography style={{ color: '#fff', fontSize: 19 }}>Sign up for an account</Typography>
          </Link>
        </Bottom>
      </Wrap>
    );
  }
}

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      errors {
        message
        path
      }
    }
  }
`;

LoginPage.propTypes = {
  values: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  errors: PropTypes.any,
};

export default compose(
  graphql(loginMutation),
  withFormik({
    mapPropsToValues: () => ({ email: '', password: '' }),
    handleSubmit: async (
      values,
      { props: { history, mutate }, setSubmitting, resetForm, setErrors },
    ) => {
      if (values.email === '' || values.password === '') {
        setSubmitting(false);
        return;
      }
      const response = await mutate({
        variables: {
          email: values.email,
          password: values.password,
        },
      });
      const {
        data: {
          login: { errors, ok },
        },
      } = response;

      if (ok) {
        history.push('/');
        return;
      }

      const errs = errors.map(err => ({ [err.path]: err.message }));

      resetForm({ email: values.email, password: '' });
      setSubmitting(false);
      setErrors([...errs]);
    },
  }),
)(LoginPage);
