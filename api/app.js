import cookie from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import { GraphQLServer } from 'graphql-yoga';

import { default as typeDefs } from './typeDefs';
import { default as resolvers } from './resolvers';
import passportInit from './lib/passport';
import session from './lib/session';

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: ({ request }) => {
    const user = request.user || null;
    return { user, request };
  },
});

server.express.use(bodyParser.urlencoded({ extended: true }));
server.express.use(session);
server.express.use(cookie());
passportInit(passport);
server.express.use(passport.initialize());
server.express.use(passport.session());

const PORT = process.env.API_PORT || 3001;

const options = {
  cors: { credentials: true, origin: '*' },
  port: PORT,
};

server.start(options, () => {
  console.log(`Server listening on: ${options.port}`); // eslint-disable-line no-console
});
