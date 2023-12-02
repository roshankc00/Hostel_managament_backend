import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    message: "Unauthorized user",
  });
});

router.get("/google/callback", async (req, res, next) => {
  passport.authenticate("google", async (err, user) => {
    if (err) {
      return next(err);
    }
    const secretKey = process.env.SECRET_KEY ?? "";
    const token = jwt.sign({ email: user["_json"].email }, secretKey, {
      expiresIn: "30d",
    });
    const newUser = await UserModel.findOne(user.email);
    if (newUser) {
      console.log(newUser._id);
      res.cookie("jwtToken", token);
      res.cookie("isLoggedIn", true);
      res.cookie("role", newUser.role);
      res.cookie("UserId", newUser._id.toString());
      res.redirect(`${process.env.CLIENT_URL}`);
      next();
    }
  })(req, res, next);
});

export default router;
