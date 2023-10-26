import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.js";
import FaqModel from "../models/faq.model.js";
import validateMongodbId from "../utils/validateMongoDbid.js";

export const createFaqHandler = asyncHandler(async (req, res, next) => {
  try {
    const { question, answer } = req.body;

    const faq = await FaqModel.create({ question, answer });

    res.status(200).json({
      success: true,
      message: "Faq created successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getSingleFaqHandler = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const isValid = validateMongodbId(id);
    console.log(isValid)
    if (!isValid) {
      return next(new ErrorHandler("Provide us the valid monogo id ", 400));
    }

    const faq = await FaqModel.findById(id);
    if (!faq) {
      return next(new ErrorHandler("faq with this id doesnt exist", 400));
    }
    res.status(200).json({
      success: true,
      faq,
    });
  } catch (error) {
    console.log(error)
    return next(new ErrorHandler(error.message, 500));
  }
});

export const getAllFaqHandler = asyncHandler(async (req, res, next) => {
  try {
    const faqs = await FaqModel.find();
    res.status(200).json({
      success: true,
      faqs,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const updateFaqHandler = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const isValid = validateMongodbId(id);
  if (!isValid) {
    return next(new ErrorHandler("Provide us the valid monogo id ", 400));
  }

  const faq = await FaqModel.findById(id);
  if (!faq) {
    return next(new ErrorHandler("faq with this id doesnt exist", 400));
  }
  const updfaq = await FaqModel.findByIdAndUpdate(
    id,
    {
      $set: req.body,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    updfaq,
  });
});
export const deleteFaqHandler = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const isValid = validateMongodbId(id);
  if (!isValid) {
    return next(new ErrorHandler("Provide us the valid monogo id ", 400));
  }

  const faq = await FaqModel.findById(id);
  if (!faq) {
    return next(new ErrorHandler("faq with this id doesnt exist", 400));
  }

  await FaqModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Faq deleted successfully",
  });
});
