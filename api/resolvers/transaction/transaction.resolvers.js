import { TransactionSchema } from '../../models/transaction';
import { UserSchema, isAuthenticated } from '../../models/user';
import { withFilter } from 'graphql-yoga';

import { PUBSUB_NEW_TRANSACTION, PUBSUB_CHANGE_BALANCE } from '../../constants';

// TODO: move to User Entry
const changeUserBalance = async (user, amount, pubsub) => {
  user.balance = user.balance + amount;
  const updatedUser = await user.save();

  pubsub.publish(PUBSUB_CHANGE_BALANCE, {
    changeBalance: {
      userId: updatedUser._id.toString(),
      balance: updatedUser.balance,
    },
  });
  return updatedUser;
};

export default {
  Query: {
    getTransactions: async (_, args, { request }) => {
      try {
        isAuthenticated(request);
        const userId = request.user._id;
        let transactions = await TransactionSchema.find({
          $or: [{ 'sender.user': userId }, { 'receiver.user': userId }],
        })
          .sort({ created: -1 })
          .limit(25)
          .exec();

        transactions = transactions.map(item => {
          const isSender = item.sender.user.toString() === userId.toString();

          return {
            amount: isSender ? -item.amount : item.amount,
            _id: item._id,
            created: item.created,
            username: isSender ? item.receiver.email : item.sender.email,
            balance: isSender ? item.sender.balance : item.receiver.balance,
          };
        });
        return { ok: true, error: null, transactions };
      } catch (error) {
        return { ok: false, error: { message: error.message } };
      }
    },
  },
  Mutation: {
    createTransaction: async (parent, { amount, username }, { user, request, pubsub }) => {
      try {
        isAuthenticated(request);
        // find receiver
        const receiver = await UserSchema.findOne(
          { email: username },
          { email: true, balance: true }
        );
        if (!receiver) throw new Error('User not found.');
        if (receiver._id.toString() === user._id.toString())
          throw new Error('Cannot be transferred to your own account');

        // get sender and check Balance
        const sender = await UserSchema.findOne({ _id: user._id }, { balance: true, email: true });
        if (sender.balance < amount) throw new Error('Balance is low.');

        // save Sender
        const updatedSender = await changeUserBalance(sender, -amount, pubsub);

        // save Receiver
        const updatedReceiver = await changeUserBalance(receiver, amount, pubsub);

        // new Transaction
        const newTransaction = new TransactionSchema({
          amount,
          username,
          sender: {
            user: sender._id,
            balance: updatedSender.balance,
            email: sender.email,
          },
          receiver: {
            user: receiver._id,
            balance: updatedReceiver.balance,
            email: receiver.email,
          },
        });

        const transaction = await newTransaction.save();

        const senderResponse = {
          _id: transaction._id,
          amount: -amount,
          username,
          balance: updatedSender.balance,
          created: transaction.created,
        };

        const receiverResponse = {
          _id: transaction._id,
          amount: amount,
          username: sender.email,
          receiverId: receiver._id.toString(),
          balance: updatedReceiver.balance,
          created: transaction.created,
        };

        pubsub.publish(PUBSUB_NEW_TRANSACTION, {
          newTransaction: receiverResponse,
        });

        return {
          error: null,
          ok: true,
          transaction: senderResponse,
        };
      } catch (error) {
        return { ok: false, error: { message: error.message } };
      }
    },
  },
  Subscription: {
    newTransaction: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(PUBSUB_NEW_TRANSACTION),
        (payload, variables, { user }) => {
          return user && payload.newTransaction.receiverId === user;
        }
      ),
    },
  },
};
