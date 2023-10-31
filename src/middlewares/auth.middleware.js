import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";

// check auth
export const checkAuth = asyncHandler(async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      next(new ErrorHandler("no token is attach to header",401));
    }
    let checktoken = req.headers.authorization.startsWith("Bearer");
    if (!checktoken) {
      next(new ErrorHandler("please register yourself first",401));
    }
    let token = req.headers.authorization.split(" ")[1];
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    const email = decoded.email;
    const user = await UserModel.findOne({ email });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error.message, 500));
  }
});

// check role
export const checkRole =
  (...roles) =>
  (req, res, next) => {
    if (roles.includes(req?.user?.role)) {
      next();
    } else {
      res.status(400).json({
        sucess: false,
        message: "you are not authorized to acess this resource",
      });
    }
  };
