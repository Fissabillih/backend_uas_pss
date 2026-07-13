import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { env } from './env';
import { UserRepository } from '../repositories/user.repository';

const userRepo = new UserRepository();

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile: Profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email found in Google profile'));
        }

        let user = await userRepo.findByGoogleId(profile.id);

        if (!user) {
          user = await userRepo.findByEmail(email);
          if (user) {
            user = await userRepo.linkGoogleId(user.id, profile.id);
          } else {
            user = await userRepo.createGoogleUser({
              googleId: profile.id,
              name: profile.displayName || email.split('@')[0],
              email,
              avatarUrl: profile.photos?.[0]?.value ?? null,
              role: 'USER',
              isActive: true,
            });
          }
        }

        if (!user.isActive) {
          return done(new Error('Account has been deactivated'));
        }

        // Map PrismaUser to Express.User (AuthPayload shape)
        const authUser: Express.User = {
          userId: user.id,
          email: user.email,
          role: user.role,
        };

        return done(null, authUser);
      } catch (err) {
        return done(err as Error);
      }
    },
  ),
);

export default passport;
