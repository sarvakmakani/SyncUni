import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      prompt: "select_account",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();

        if (
          email.endsWith("@charusat.edu.in") ||
          email.endsWith("@charusat.ac.in")
        ) {
          let user = await User.findOne({ email });

          if (!user) {
            user = new User({
              googleId: profile.id,
              email,
              name: profile.name.familyName,
              idNo: profile.name.givenName,
              avatar: profile.photos?.[0]?.value,
            });
            await user.save();
          }

          return done(null, user);
        } else {
          return done(null, false, { message: "Unauthorized domain" });
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
