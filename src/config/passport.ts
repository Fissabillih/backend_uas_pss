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
          return done(new Error('No email found in Google profile'), undefined);
        }

        // Cek apakah user sudah ada berdasarkan googleId
        let user = await userRepo.findByGoogleId(profile.id);

        if (!user) {
          // Cek apakah email sudah terdaftar (akun manual)
          user = await userRepo.findByEmail(email);

          if (user) {
            // Link akun Google ke akun yang sudah ada
            user = await userRepo.linkGoogleId(user.id, profile.id);
          } else {
            // Buat akun baru via Google
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
          return done(new Error('Account has been deactivated'), undefined);
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error, undefined);
      }
    },
  ),
);

export default passport;
