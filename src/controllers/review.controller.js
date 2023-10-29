import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.js";
import ReviewModel from "../models/review.model.js";
import HostelModel from "../models/hostel.model.js";

export const createReviewHandler = asyncHandler(async (req, res, next) => {
  try {
    const { hostel: hostelId } = req.body;
    const isHostelValid = await HostelModel.findOne({ _id: hostelId });
    if (!isHostelValid) {
      next(new ErrorHandler("hostel with this id doent exist", 400));
    }

    const reviewExist = await ReviewModel.findOne({
      user: req.user._id,
      hostel: hostelId,
    });
    if (reviewExist) {
      const updReview = await ReviewModel.findByIdAndUpdate(
        reviewExist._id,
        { $set: { rating: req.body.rating, comment: req.body.comment } },
        { new: true }
      )
        .populate("user", "name email")
        .select("rating comment name");
      return res.status(200).json({
        success: true,
        updReview,
        message: "Review updated successfully",
      });
    } else {
      req.body.user = req.user._id;
      const review = await ReviewModel.create(req.body);
      const responseReview = await ReviewModel.findById(review._id)
        .populate("user", "name email")
        .select("rating comment name");
      res.status(201).json({
        success: true,
        message: "Review done successfully",
        review: responseReview,
      });
    }
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error.message, 500));
  }
});

export const getAllReviews = asyncHandler(async (req, res, next) => {
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

export const getSingleReview = asyncHandler(async (req, res, next) => {
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
      return next(new ErrorHandler("Review with this id doesnt exist", 500));
    }
    res.status(201).json({
      success: true,
      review: review,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const updateReview = asyncHandler(async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const review = await ReviewModel.findOne({ _id: req.params.id })
      .populate("user", "name email")
      .select("rating comment name");
    if (!review) {
      return next(new ErrorHandler("Review with this id doesnt exist", 404));
    }
    //check for permission
    review.rating = rating;
    review.comment = comment;
    await review.save();
    res.status(201).json({
      success: true,
      message: "Review updated successfully",
      updReview: review,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const deleteReview = asyncHandler(async (req, res, next) => {
  try {
    const review = await ReviewModel.findOne({ _id: req.params.id });
    if (!review) {
      return next(new ErrorHandler("Review not found", 404));
    }
    await review.deleteOne();
    // check for permission
    res.status(200).json({
      success: true,
      msg: "Review deleted",
    });
  } catch (error) {
    next(new ErrorHandler("Failed to delete review: " + error.message, 500));
  }
});

export const getAllReviewsOfHostelHandler = asyncHandler(
  async (req, res, next) => {
    try {
      const { hostel } = req.body;
      const hostelExist = await HostelModel.findById(hostel);
      if (!hostelExist) {
        return next(new ErrorHandler("Hostel with this id doenst exist", 404));
      }
      const reviews = await ReviewModel.find({ hostel })
        .populate("user", "name email")
        .select("rating comment name");

      res.status(200).json({
        success: true,
        reviews,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);
