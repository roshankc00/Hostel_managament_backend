import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.js";
import HostelModel from "../models/hostel.model.js";
import validateMongodbId from "../utils/validateMongoDbid.js";
import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";

export const RegisterHostelHandler = asyncHandler(async (req, res, next) => {
  try {
    const { name, hostelName, phone, email, password } = req.body;
    const hostelExists = await HostelModel.findOne({ name: hostelName });

    if (hostelExists) {
      return next(new ErrorHandler("Hostel with this name already exist", 400));
    }

    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      return next(new ErrorHandler("User with this email already exist", 400));
    }
    const newUser = await UserModel.create({
      name,
      email,
      password,
      phone,
      role: "owner",
    });

    const newHostel = await HostelModel.create({
      name,
      email,
      phone,
      user: newUser._id,
    });

    newUser.hostel = newHostel._id;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Hostel And user registered successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getSingleHostelHandler = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const isValid = validateMongodbId(id);
    if (!isValid) {
      return next(new ErrorHandler("The id is not valid", 400));
    }

    const hostel = await HostelModel.findById(id).populate("review");

    if (!hostel) {
      return next(new ErrorHandler("hostel with this id doesnt exist", 404));
    }

    res.status(200).json({
      success: true,
      hostel,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getAllHostelHandler = asyncHandler(async (req, res, next) => {
  try {
    const hostels = await HostelModel.find();
    console.log(req.user);

    res.status(200).json({
      success: true,
      hostels,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const addImages = asyncHandler(async (req, res, next) => {
  try {
    const id = req.body.hostelId;

    const hostel = await HostelModel.findById(id);

    for (let file of req.files) {
      let result;
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg"
      ) {
        result = await cloudinary.v2.uploader.upload(file.path);
        hostel.images.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    }

    for (let file of req.files) {
      try {
        fs.unlinkSync(file.path);
        console.log("Delete File successfully.");
      } catch (error) {
        console.log(error);
      }
    }

    await hostel.save();

    res.status(200).json({
      success: true,
      hostel,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error.message, 500));
  }
});

export const addthumbnailUrlHandler = asyncHandler(async (req, res, next) => {
  try {
    const id = req.body.hostelId;
    const hostel = await HostelModel.findById(id);

    const result = await cloudinary.v2.uploader.upload(req.file.path);
    hostel.thumbnailUrl = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    try {
      fs.unlink(req.file.path);
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }

    await hostel.save();
    res.status(200).json({
      success: true,
      hostel,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const updateHostelContentHandler = asyncHandler(
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const isValid = validateMongodbId(id);
      if (!isValid) {
        return next(new ErrorHandler("The id is not valid", 400));
      }

      const hostel = await HostelModel.findById(id);

      if (!hostel) {
        return next(new ErrorHandler("hostel with this id doesnt exist", 404));
      }
      await HostelModel.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        { new: true }
      );

      const updHostel = await HostelModel.findById(id).populate("review");

      res.status(200).json({
        success: true,
        updHostel,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

export const addHostelRulesAndTime = asyncHandler(async (req, res, next) => {
  try {
    const { rulesAndRegulation, timeSchedule } = req.body;

    const id = req.params.id;
    const isValid = validateMongodbId(id);
    if (!isValid) {
      return next(new ErrorHandler("The id is not valid", 400));
    }

    const hostel = await HostelModel.findById(id);

    if (!hostel) {
      return next(new ErrorHandler("hostel with this id doesnt exist", 404));
    }

    if (rulesAndRegulation) {
      hostel.rulesAndRegulation.push(rulesAndRegulation);
    }
    if (timeSchedule) {
      hostel.timeSchedule.push({
        time: timeSchedule.time,
        title: timeSchedule.title,
      });
    }

    hostel.save();

    res.status(200).json({
      success: true,
      hostel,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
