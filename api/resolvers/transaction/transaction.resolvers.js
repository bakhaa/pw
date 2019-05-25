import { TransactionSchema } from '../../models/transaction';
import { UserSchema, isAuthenticated } from '../../models/user';

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
    createTransaction: async (parent, { amount, username }, { request }) => {
      try {
        isAuthenticated(request);
        // find receiver
        const receiver = await UserSchema.findOne(
          { email: username },
          { email: true, balance: true }
        );
        if (!receiver) throw new Error('User not found.');
        if (receiver._id.toString() === request.user._id.toString())
          throw new Error('Cannot be transferred to your own account');

        // get sender and check Balance
        const sender = await UserSchema.findOne(
          { _id: request.user._id },
          { balance: true, email: true }
        );
        if (sender.balance < amount) throw new Error('Balance is low.');

        // save Sender
        sender.balance = sender.balance - amount;
        const updatedSender = await sender.save();

        // save Receiver
        receiver.balance = receiver.balance + amount;
        const updatedReceiver = await receiver.save();

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

        const data = {
          _id: transaction._id,
          amount: -amount,
          username,
          balance: updatedSender.balance,
          created: transaction.created,
        };

        return {
          error: null,
          ok: true,
          transaction: data,
        };
      } catch (error) {
        return { ok: false, error: { message: error.message } };
      }
    },
  },
};
