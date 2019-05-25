import session from 'express-session';
import mongoose from './mongoose';

const MongoStore = require('connect-mongo')(session);

module.exports = session({
  secret: 'secret',
  key: 'sid',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  proxy: true,
  resave: true,
  saveUninitialized: false,
});
