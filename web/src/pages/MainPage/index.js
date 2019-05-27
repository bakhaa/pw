import React from 'react';

import UserInfo from '../../components/UserInfo';
import Transactions from '../../components/Transactions';
import CreateTransaction from '../../components/CreateTransaction';

const MainPage = ({ me }) => (
  <>
    <UserInfo me={me} />
    <CreateTransaction />
    <Transactions />
  </>
);

export default MainPage;
