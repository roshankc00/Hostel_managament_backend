import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.js";
import validateMongodbId from "../utils/validateMongoDbid.js";
import timeModel from "../models/time.model.js";

export const addHostelTime = asyncHandler(async (req, res, next) => {
  try {
    const { title, time, category, hostelId } = req.body;

    const isValid = validateMongodbId(hostelId);
    if (!isValid) {
      return next(new ErrorHandler("The id is not valid", 400));
    }

    const timeShedule = await timeModel.create({
      title,
      time,
      category,
      hostel: hostelId,
    });

    res.status(200).json({
      success: true,
      message: "Time table created successfully",
      timeShedule,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getAllTimes = asyncHandler(async (req, res, next) => {
  try {
    const { hostelId } = req.body;
    const times = await timeModel.find({ hostel: hostelId });
    res.status(200).json({
      success: true,
      times,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const updateTimes = asyncHandler(async (req, res, next) => {
  try {
    const { title, time, category } = req.body;
    const times = await timeModel.findById(req.params.id);

    if (!times) {
      return res.status(404).json({
        success: false,
        message: "Times not found",
      });
    }

    if (!title || !time || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, time, and category are required",
      });
    }

    times.title = title;
    times.time = time;
    times.category = category;

    await times.save();

    res.status(200).json({
      success: true,
      times,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const deleteTimes = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new ErrorHandler("Rule ID parameter is required", 400));
    }

    const deletedtime = await timeModel.findByIdAndRemove(id);

    if (!deletedtime) {
      return res.status(404).json({
        success: false,
        message: "Rule not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
