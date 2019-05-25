import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

ObjectId.prototype.valueOf = function () {
  return this.toString();
};

const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
const DATABASE_NAME = process.env.DATABASE_NAME || 'db';
const MONGO_URI = `mongodb://${DATABASE_HOST}/${DATABASE_NAME}`;

/* connection mongoose */
mongoose.Promise = global.Promise;
mongoose.connect(
  MONGO_URI,
  { socketTimeoutMS: 0, connectTimeoutMS: 0, useNewUrlParser: true, useCreateIndex: true },
);

/* connected cb mongoose */
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected'); // eslint-disable-line no-console
});

/* die on error */
mongoose.connection.on('error', err => {
  console.log('Mongoose error', err); // eslint-disable-line no-console
});

module.exports = mongoose;
