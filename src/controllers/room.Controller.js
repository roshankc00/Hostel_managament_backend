import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.js";
import RoomModel from "../models/HostelRoom.model.js";
import cloudinary from "../config/cloudinary.config.js";
import HostelModel from "../models/hostel.model.js";

export const createHostelRoom = asyncHandler(async (req, res, next) => {
  try {
    const { name, price, description, hostelId } = req.body;
    const myCloud = await cloudinary.v2.uploader.upload(req.file.path);

    const image = {
      url: myCloud.secure_url,
      publicId: myCloud.public_id,
    };

    const hostel = await RoomModel.create({
      name,
      price,
      description,
      hostelId,
      image,
    });
    res.status(201).json({
      success: true,
      message: "Room added successfully",
      hostel,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getAllRoomsOfHostel = asyncHandler(async (req, res, next) => {
  try {
    const { hostelId } = req.body;
    const rooms = await RoomModel.find({ hostelId });

    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const deleteHostel = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const room = await RoomModel.findById(id);

    if (!room) {
      return next(new ErrorHandler("hostel with this id doesnt exist", 400));
    }

    await cloudinary.v2.uploader.destroy(hostel?.image?.publicId);

    await HostelModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
