import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.js";
import ReviewModel from "../models/review.model.js";
import HostelModel from "../models/hostel.model.js";

export const createReviewHandler = asyncHandler(async (req, res) => {
  try {
    console.log(req.user);
    const { hostel: hostelId } = req.body;
    const isHostelValid = await HostelModel.findOne({ _id: hostelId });
    if (!isHostelValid) {
      next(new ErrorHandler(error.message, 500));
    }
    req.body.user = req.user._id;
    const review = await ReviewModel.create(req.body);
    res.status(201).json({
      success: true,
      message: "Review done successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getAllReviews = asyncHandler(async (req, res) => {
  try {
    const reviews = await ReviewModel.find({})
      .populate({
        path: "user",
        select: "name ",
      })
      .populate({
        path: "hostel",
        select: "name ",
      });
    res.status(201).json({
      success: true,
      reviews: reviews,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getSingleReview = asyncHandler(async (req, res) => {
  try {
    const review = await ReviewModel.findOne({ _id: req.params.id })
      .populate({
        path: "user",
        select: "name ",
      })
      .populate({
        path: "hostel",
        select: "name ",
      });
    if (!review) {
      next(new ErrorHandler(error.message, 500));
    }
    res.status(201).json({
      success: true,
      review: review,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
