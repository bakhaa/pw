import React from 'react';
import styled from 'styled-components';

import UserInfo from '../../components/UserInfo';
import Transactions from '../../components/Transactions';

const SearchUsers = styled.div``;

const MainPage = ({ me, ...own }) => (
  <>
    <UserInfo me={me} />
    <SearchUsers />
    <Transactions />
  </>
);

export default MainPage;
