import passport from 'passport';
import { UserSchema, isAuthenticated } from '../../models/user';
import { withFilter } from 'graphql-yoga';

import { PUBSUB_CHANGE_BALANCE } from '../../constants';

export default {
  User: {},
  Query: {
    getUsers: async (_, { search }, { request }) => {
      try {
        isAuthenticated(request);
        const users = await UserSchema.find({ username: { $regex: search } })
          .limit(10)
          .exec();
        return { ok: true, errors: [], users };
      } catch (error) {
        return { ok: false, errors: [{ message: error.message, path: 'login' }] };
      }
    },
    me: async (parent, args, { user, request }) => {
      try {
        isAuthenticated(request);
        return { ok: true, user };
      } catch (error) {
        return { ok: true, error: { message: 'Not authenticated' } };
      }
    },
  },
  Mutation: {
    login: (parent, args, ctx) =>
      new Promise((resolve, reject) => {
        passport.authenticate('local', (err, user, info) => {
          if (err) reject(err);
          if (!user || info) {
            return resolve({
              user: null,
              ok: false,
              errors: [{ message: 'Incorrect login or password', path: 'email' }],
            });
          }

          return ctx.request.logIn(user, error => {
            if (error) reject(error);
            return resolve({ errors: [], user, ok: true });
          });
        })({ query: args });
      }),
    logout: (_, __, ctx) => {
      try {
        ctx.request.logout();
        return { ok: true };
      } catch (error) {
        return { ok: false };
      }
    },
    register: async (parent, args) => {
      try {
        const userExists = await UserSchema.findOne({ email: args.email });
        if (userExists) {
          return {
            ok: false,
            errors: [{ message: 'Email alredy exists', path: 'email' }],
          };
        }

        const user = new UserSchema({ ...args, username: args.email });
        await user.save();

        return { ok: true, user };
      } catch (err) {
        return {
          ok: false,
          errors: [{ message: 'Error create user', path: 'register' }],
        };
      }
    },
  },
  Subscription: {
    changeBalance: {
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(PUBSUB_CHANGE_BALANCE),
        (payload, variables, { user }) => {
          return user && payload.changeBalance.userId === user;
        }
      ),
    },
  },
};
