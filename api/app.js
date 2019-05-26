import cookie from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import { GraphQLServer, PubSub } from 'graphql-yoga';

import { default as typeDefs } from './typeDefs';
import { default as resolvers } from './resolvers';
import passportInit from './lib/passport';
import session from './lib/session';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: ({ request, connection }) => {
    let user = request ? request.user : null;
    if (connection) {
      if (connection.context.user) user = connection.context.user;
    }
    return { user, request, pubsub };
  },
});

server.express.use(bodyParser.urlencoded({ extended: true }));
server.express.use(session);
server.express.use(cookie());
passportInit(passport);
server.express.use(passport.initialize());
server.express.use(passport.session());

const PORT = process.env.API_PORT || 3001;

const FRONTEND_HOST = process.env.FRONTEND_HOST ? process.env.FRONTEND_HOST : 'localhost';
const FRONTEND_PORT = process.env.FRONTEND_PORT ? process.env.FRONTEND_PORT : '3000';

const origin = `http://${FRONTEND_HOST}:${FRONTEND_PORT}`;

const options = {
  cors: { credentials: true, origin },
  port: PORT,
  subscriptions: {
    onConnect: async (connectionParams, webSocket) => {
      try {
        const promise = new Promise((resolve, reject) => {
          session(webSocket.upgradeReq, {}, () => {
            resolve(webSocket.upgradeReq.session.passport);
          });
        });
        const user = await promise;
        return user;
      } catch (error) {
        console.log('error', error);
      }
    },
  },
};

server.start(options, () => {
  console.log(`Server listening on: ${options.port}`); // eslint-disable-line no-console
});
