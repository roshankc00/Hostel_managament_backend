import contactFormModel from "../models/contact.model.js";
import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.js";
import validateMongodbId from "../utils/validateMongoDbid.js";

export const createContactForm = asyncHandler(async (req, res, next) => {
  try {
    const contactForm = await contactFormModel.create(req.body);
    res.status(200).json({
      success: true,
      message: "Your msg has been recorded",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getAllContactForm = asyncHandler(async (req, res, next) => {
  try {
    const contactForms = await contactFormModel.find();
    res.status(200).json({
      success: true,
      contactForms,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getSingleContactForm = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const contactForm = await contactFormModel.find({ _id: id });
    const isValid = validateMongodbId(id);
    if (!isValid) {
      return next(new ErrorHandler("Provide us the valid monogo id ", 400));
    }
    res.status(200).json({
      success: true,
      contactForm,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const deleteContactForm = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const contactForm = await contactFormModel.find({ _id: id });
    if (!contactForm) {
      return next(new ErrorHandler("No contactForm with such id found ", 400));
    }
    await contactFormModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      msg: "Deleted successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
