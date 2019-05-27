import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import UserInfo from '../../components/UserInfo';
import Transactions from '../../components/Transactions';
import CreateTransaction from '../../components/CreateTransaction';
import Users from '../../components/Users';

const Bottom = styled.section`
  display: flex;
`;

const MainPage = ({ me }) => {
  const [search, setSearch] = useState('');

  return (
    <>
      <UserInfo me={me} />
      <CreateTransaction search={search} setSearch={setSearch} />
      <Bottom>
        <Users setSearch={setSearch} search={search} />
        <Transactions />
      </Bottom>
    </>
  );
};

MainPage.propTypes = {
  me: PropTypes.any,
};

export default MainPage;
