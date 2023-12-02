import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.js";
import { generateLast12MonthlData } from "../utils/analytics.js";
import UserModel from "../models/user.model.js";
import HostelModel from "../models/hostel.model.js";
import OrderModel from "../models/order.model.js";

export const getHostelAnalytics = asyncHandler(async (req, res, next) => {
  try {
    const hostels = await generateLast12MonthlData(HostelModel);
    res.status(200).json({
      sucess: true,
      hostels,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getUserAnalytics = asyncHandler(async (req, res, next) => {
  try {
    const users = await generateLast12MonthlData(UserModel);
    res.status(200).json({
      sucess: true,
      users,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
export const getOrderAnalytics = asyncHandler(async (req, res, next) => {
  try {
    const orders = await generateLast12MonthlData(OrderModel);
    res.status(200).json({
      sucess: true,
      orders,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
