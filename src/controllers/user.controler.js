import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.js";
import  UserModel  from "../models/user.model.js";
import { createToken } from "../utils/jwt.js";
import validateMongodbId from "../utils/validateMongoDbid.js";

export const registerUserHandler = asyncHandler(async (req, res, next) => {
  try {
    console.log(req.body)
    const userExist = await UserModel.findOne({ email: req.body.email });

    if (userExist) {
      return next(new ErrorHandler("User already exist", 400));
    }
    const newUser = await UserModel.create(req.body);

    res.status(201).json({
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

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      name: existUser.name,
      role: existUser.role,
      userId: existUser._id,
    });
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
    if(!user){
        return next(new ErrorHandler("User doesnt exist with this id",404))
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});



