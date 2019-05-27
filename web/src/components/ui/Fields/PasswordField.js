import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';

const fieldStyle = { width: 300, height: 50, marginBottom: 20 };

const PasswordField = ({
  value,
  error,
  showPassword,
  name,
  placeholder,
  onChange,
  onBlur,
  onChangeShowPassword,
}) => (
  <TextField
    style={fieldStyle}
    value={value}
    type={showPassword ? 'text' : 'password'}
    name={name}
    error={error}
    placeholder={placeholder}
    variant="outlined"
    onChange={onChange}
    onBlur={onBlur}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <IconButton aria-label="Toggle password visibility" onClick={onChangeShowPassword}>
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
);

PasswordField.propTypes = {
  value: PropTypes.string.isRequired,
  error: PropTypes.any,
  showPassword: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.any,
  onChangeShowPassword: PropTypes.func.isRequired,
};

export default PasswordField;
