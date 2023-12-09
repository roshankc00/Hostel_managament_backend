import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.js";
import validateMongodbId from "../utils/validateMongoDbid.js";
import rulesModel from "../models/rules.model.js";

export const addHostelRules = asyncHandler(async (req, res, next) => {
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
      rule,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getAllRules = asyncHandler(async (req, res, next) => {
  try {
    const { hostelId } = req.body;
    const rules = await rulesModel.find({ hostel: hostelId });
    res.status(200).json({
      success: true,
      rules,
    });
    console.log(rules);
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const updateRule = asyncHandler(async (req, res, next) => {
  try {
    const { title } = req.body;
    const rules = await rulesModel.findById(req.params.id);

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    rules.title = title;

    await rules.save();

    res.status(200).json({
      success: true,
      message: "Title updated",
      rules,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const deleteRule = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new ErrorHandler("Rule ID parameter is required", 400));
    }

    const deletedRule = await rulesModel.findByIdAndRemove(id);

    if (!deletedRule) {
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
