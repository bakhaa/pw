import { Strategy as LocalStrategy } from 'passport-local';
import { UserSchema } from '../models/user';

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserSchema.findById(id);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await UserSchema.findOne({ email });

          if (!user) {
            return done(null, false);
          }

          const verify = await user.verifyPassword(password);

          if (!verify) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
