import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.js";
import UserModel from "../models/user.model.js";
import { createToken } from "../utils/jwt.js";
import validateMongodbId from "../utils/validateMongoDbid.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import { sendMail } from "../utils/sendmail.js";

export const registerUserHandler = asyncHandler(async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const userExist = await UserModel.findOne({ email: req.body.email });

    if (userExist) {
      return next(new ErrorHandler("User already exist", 400));
    }

    const user = {
      email,
      password,
      name,
    };
    const activationToken = createActivationToken(user);

    const activationCode = activationToken.activationcode;
    const data = { user: { name: user.name }, activationCode };
    const html = `<div> <p>  Your Activation Code is  <br/>$<h1> ${activationCode} </h1> <br/> Thanks for registering at Our Hostel <br/> If you havent register at the our hostel then please kindlty ignore this mail sry  </p> </div>`;
    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        html,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }

    res.status(201).json({
      success: true,
      message: "please check your email to activate your account",
      activationToken: activationToken.token,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const createActivationToken = (user) => {
  const activationcode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    {
      user,
      activationcode,
    },
    process.env.ACTIVATION_SECRET,
    { expiresIn: "5m" }
  );

  return { token, activationcode };
};

export const activateUserHandler = asyncHandler(async (req, res, next) => {
  try {
    const { activation_token, activation_code } = req.body;
    console.log(activation_code, activation_token);
    const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    if (newUser.activationcode !== activation_code) {
      return next(new ErrorHandler("Invalid activation Code ", 400));
    }
    const { name, email, password } = newUser.user;

    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return next(new ErrorHandler("Email already exist", 400));
    }

    const user = await UserModel.create({
      name,
      email,
      password,
    });

    res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const loginUserHandler = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existUser = await UserModel.findOne({ email });

    if (!existUser) {
      return next(new ErrorHandler("Invalid credential", 401));
    }

    const isPasswordCorrect = await existUser.matchPassword(password);
    if (!isPasswordCorrect) {
      return next(new ErrorHandler("Invalid credential", 401));
    }

    const token = createToken(existUser);

    if (existUser.hostel) {
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token,
        name: existUser.name,
        role: existUser.role,
        userId: existUser._id,
        hostelId: existUser.hostel,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token,
        name: existUser.name,
        role: existUser.role,
        userId: existUser._id,
      });
    }
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getSingleUserHandler = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const validId = validateMongodbId(id);

    if (!validId) {
      return next(new ErrorHandler("Please provide the valid userId", 400));
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return next(new ErrorHandler("User doesnt exist with this id", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getAllUserHandler = asyncHandler(async (req, res, next) => {
  try {
    const users = await UserModel.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
export const changeEmailHandler = asyncHandler(async (req, res, next) => {
  try {
    const { newEmail } = req.body;
    console.log(req.user);
    const user = await UserModel.findById(req.user._id);
    user.email = newEmail;
    await user.save();
    res.status(200).json({
      success: true,
      message: "User email updated successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
export const changePasswordHandler = asyncHandler(async (req, res, next) => {
  try {
    const { newPassword, oldPassword } = req.body;
    const user = await UserModel.findById(req.user._id);
    const isPasswordCorrect = await user.matchPassword(oldPassword);
    if (!isPasswordCorrect) {
      return next(new ErrorHandler("Invalid credential", 401));
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "User password updated successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const changeNameHandler = asyncHandler(async (req, res, next) => {
  try {
    const { newName } = req.body;
    const user = await UserModel.findById(req.user._id);
    user.name = newName;
    await user.save();
    res.status(200).json({
      success: true,
      message: "User Name updated successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
