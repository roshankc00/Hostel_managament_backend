import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.js";
import HostelModel from "../models/hostel.model.js";
import validateMongodbId from "../utils/validateMongoDbid.js";
import rulesModel from "../models/rules.model.js";

export const addHostelTime = asyncHandler(async (req, res, next) => {
  try {
    const { title, hostelId } = req.body;

    const isValid = validateMongodbId(hostelId);
    if (!isValid) {
      return next(new ErrorHandler("The id is not valid", 400));
    }

    const rule = await rulesModel.create({ title, hostel: hostelId });

    res.status(200).json({
      success: true,
      message: "Rules created successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
