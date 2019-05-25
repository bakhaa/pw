import bcrypt from 'bcrypt';
import mongoose from '../../lib/mongoose';

const { Schema } = mongoose;
const SALT_WORK_FACTOR = 12;

const userSchema = new Schema({
  username: { type: String, default: '' },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  balance: { type: Number, required: true, default: 500 },
  created: { type: Date, default: Date.now },
  updated: { type: Date },
});

userSchema.pre('save', async function(next) {
  try {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // generate a salt
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    // hash the password using our new salt
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.verifyPassword = function(candidatePassword) {
  try {
    return bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

const model = mongoose.model('User', userSchema);

export default model;
