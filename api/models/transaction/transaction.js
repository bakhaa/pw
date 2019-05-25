import mongoose from '../../lib/mongoose';

import { UserSchema } from '../user';

const { Schema } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const transactionSchema = new Schema({
  amount: { type: Number, required: true },
  sender: {
    user: { type: ObjectId, ref: 'User' },
    balance: { type: Number },
    email: { type: String },
  },
  receiver: {
    user: { type: ObjectId, ref: 'User' },
    balance: { type: Number },
    email: { type: String },
  },
  created: { type: Date, default: Date.now },
});

const model = mongoose.model('Transaction', transactionSchema);

export default model;
