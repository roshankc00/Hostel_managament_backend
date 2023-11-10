import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.js";
import HostelModel from "../models/hostel.model.js";
import validateMongodbId from "../utils/validateMongoDbid.js";
import rulesAndTimeModel from "../models/rulesTime.model.js";

export const addHostelTime = asyncHandler(async (req, res, next) => {
  try {
    const { timeSchedule } = req.body;

    const hostelId = req.params.id;
    const isValid = validateMongodbId(hostelId);
    if (!isValid) {
      return next(new ErrorHandler("The id is not valid", 400));
    }

    const hostel = await HostelModel.findById(hostelId);
    if (!hostel) {
      return next(new ErrorHandler("Hostel with this id doesn't exist", 404));
    }

    const times = await rulesAndTimeModel.find({ hostel: hostelId });
    if (times.length === 0) {
      await rulesAndTimeModel.create({
        timeSchedule: [timeSchedule],
        hostel: hostelId,
      });
    } else {
      await rulesAndTimeModel.findByIdAndUpdate(
        times[0]._id,
        { $push: { timeSchedule: timeSchedule } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      times,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const addHostelRules = asyncHandler(async (req, res, next) => {
  try {
    const { rulesAndRegulation } = req.body;

    const hostelId = req.params.id;
    const isValid = validateMongodbId(hostelId);
    if (!isValid) {
      return next(new ErrorHandler("The id is not valid", 400));
    }

    const hostel = await HostelModel.findById(hostelId);
    if (!hostel) {
      return next(new ErrorHandler("Hostel with this id doesn't exist", 404));
    }

    const rules = await rulesAndTimeModel.find({ hostel: hostelId });
    if (rules.length === 0) {
      await rulesAndTimeModel.create({ rulesAndRegulation, hostel: hostelId });
    } else {
      await rulesAndTimeModel.findByIdAndUpdate(
        rules[0]._id,
        { $push: { rulesAndRegulation: rulesAndRegulation } },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      rules,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
