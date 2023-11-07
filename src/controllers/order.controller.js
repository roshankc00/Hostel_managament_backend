import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.js";
import OrderModel from "../models/order.model.js";

export const createOrder = asyncHandler(async (req, res) => {
  try {
    const { hostelId, phone } = req.body;

    const newOrder = await OrderModel.create({
      hostel: hostelId,
      phone,
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Order Created successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const findSingleOrder = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const isValid = validateMongodbId(id);
    if (!isValid) {
      return next(new ErrorHandler("The id is not valid", 400));
    }
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler("order not found", 400));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getAllTheOrderOfHostel = asyncHandler(async (req, res) => {
  try {
    const allOrders = await OrderModel.find({ hostel: req.body.hostelId });
    res.status(200).json({
      success: true,
      allOrders,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
