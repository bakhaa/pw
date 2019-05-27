import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { Typography } from '@material-ui/core';

const Wrap = styled.div`
  background: ${props => (props.selected ? '#e1e3e4' : '#e8eaeb')};
  border: ${props => (props.selected ? '1px solid #b1b2b3' : '1px solid transparent')};
  height: 80px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 300px;
  border-radius: 3px;
  cursor: pointer;
`;

const loading = keyframes`
  0%,to {
    opacity: 1
  }
  50% {
    opacity: .3
  }
`;

const LoadingWrap = styled.div`
  background: #e8eaeb;
  height: 70px;
  margin-bottom: 10px;
  width: 300px;
  border-radius: 3px;
  background-color: rgba(51, 51, 51, 0.08);
  animation: ${loading} 1.5s infinite;
`;

const Username = styled.div`
  width: 60%;
`;

const UsernameText = styled(Typography)``;

const SmallText = styled(Typography)`
  color: gray;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #cdcfd0;
`;

const User = ({ data, search, setSearch }) => {
  if (!data) return <LoadingWrap />;

  return (
    <Wrap selected={data.username === search} onClick={() => setSearch(data.username)}>
      <Avatar />
      <Username>
        <SmallText style={{ fontSize: 14 }}>Username</SmallText>
        <UsernameText>{data.username}</UsernameText>
      </Username>
    </Wrap>
  );
};

User.propTypes = {
  search: PropTypes.any,
  setSearch: PropTypes.any,
  data: PropTypes.any,
};

export default User;
