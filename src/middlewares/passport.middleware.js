import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import 'dotenv/config'
import UserModel from "../models/user.model.js";

const clientId =process.env.GOOGLE_CLIENT_ID ?? "";
const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";

export const passportInitialize = () => {
  passport.use(
    new Strategy(
      {
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: "/auth/google/callback",
      },
      async function (
        accessToken,
        refreshToken,
        profile,
        cb
      ) {
        console.log(profile);
        const existUser =await UserModel.findOne({email:profile['_json'].email})

        if(existUser){
          cb(null, profile);
        }
        else{
          const data={
            name:profile['_json'].name,
            email:profile['_json'].email,
          }
          const user=new UserModel(data);
          await user.save();
          cb(null, profile);
        }
      }
    )
  );
  

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

export default passport;
