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
          const domain= email.split('@')[1];
          let isAdmin= false
          if(domain=="charusat.ac.in" || email=="23dce066@charusat.edu.in" || email=="23dce109@charusat.edu.in") isAdmin=true
          if (!user) {
            user = new User({
              googleId: profile.id,
              email: email,
              name: profile.name.familyName,
              idNo: profile.name.givenName,
              avatar: profile.photos?.[0]?.value,
              isAdmin: isAdmin
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


// {
//   "_id": {
//     "$oid": "68b724ee9bcdca96f09a3c49"
//   },
//   "name": "HET SAVANI",
//   "email": "23dce109@charusat.edu.in",
//   "idNo": "23DCE109",
//   "googleId": "109414648702842824500",
//   "isAdmin": true,
//   "avatar": "https://lh3.googleusercontent.com/a/ACg8ocJ7bSg1dIeIOjisieDGj0NcXIA0PJa_meYQXYrfYb-wlkiSew=s96-c",
//   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGI3MjRlZTliY2RjYTk2ZjA5YTNjNDkiLCJnb29nbGVJZCI6IjEwOTQxNDY0ODcwMjg0MjgyNDUwMCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTc1ODUzOTQ2MywiZXhwIjoxNzU5MTQ0MjYzfQ.hhURtXWSVumPhEa93TKfLA6pYqqZ_zo8LYxnCa1yA3I",
//   "createdAt": {
//     "$date": "2025-09-02T17:10:06.452Z"
//   },
//   "updatedAt": {
//     "$date": "2025-09-22T11:11:03.599Z"
//   },
//   "__v": 0
// }