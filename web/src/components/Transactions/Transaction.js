import React from 'react';
import styled, { keyframes } from 'styled-components';
import moment from 'moment';
import { Typography } from '@material-ui/core';

const Wrap = styled.div`
  background: #e8eaeb;
  height: 80px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  width: 100%;
  border-radius: 3px;
  padding: 0 50px;
  flex-direction: column;
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
  width: 100%;
  border-radius: 3px;
  padding: 0 50px;
  background-color: rgba(51, 51, 51, 0.08);
  animation: ${loading} 1.5s infinite;
`;

const Top = styled.div`
  display: flex;
  width: 100%;
`;

const Amount = styled.div`
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AmountText = styled(Typography)``;

const Username = styled.div`
  width: 60%;
`;

const UsernameText = styled(Typography)``;

const DateWrap = styled.div`
  align-self: flex-end;
`;

const Balance = styled.div`
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
const BalanceText = styled(Typography)``;
const SmallText = styled(Typography)`
  color: gray;
`;

const Transaction = ({ data }) => {
  if (!data) return <LoadingWrap />;
  const colorAmount = data.amount > 0 ? 'green' : 'red';
  // console.log('Date.parse(data.created)', moment.toISOString(data.created));
  return (
    <Wrap>
      <Top>
        <Username>
          <SmallText style={{ fontSize: 14 }}>Username</SmallText>
          <UsernameText>{data.username}</UsernameText>
        </Username>
        <Amount>
          <SmallText style={{ fontSize: 14 }}>Amount</SmallText>
          <AmountText style={{ color: colorAmount }}>{data.amount}</AmountText>
        </Amount>
        <Balance>
          <SmallText style={{ fontSize: 14 }}>Balance</SmallText>
          <BalanceText>{data.balance}</BalanceText>
        </Balance>
      </Top>

      <DateWrap>
        <SmallText>{data.created}</SmallText>
      </DateWrap>
    </Wrap>
  );
};

export default Transaction;
