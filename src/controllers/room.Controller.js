import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.js";
import RoomModel from "../models/HostelRoom.model.js";
import cloudinary from "../config/cloudinary.config.js";
import HostelModel from "../models/hostel.model.js";

export const createHostelRoom = asyncHandler(async (req, res, next) => {
  try {
    const { name, price, description, hostelId, totalVacentRooms, totalRooms } =
      req.body;
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
      totalVacentRooms,
      totalRooms,
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

export const deleteHostelRoom = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const room = await RoomModel.findById(id);

    if (!room) {
      return next(new ErrorHandler("hostel with this id doesnt exist", 400));
    }
    await RoomModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getSingleHostelRoom = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const room = await RoomModel.findById(id);

    if (!room) {
      return next(
        new ErrorHandler("hostel room  with this id doesnt exist", 400)
      );
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const EditHostelRoom = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const { uploadImage } = req.body;
    const room = await RoomModel.findById(id);
    if (!room) {
      return next(
        new ErrorHandler("hostel room  with this id doesnt exist", 400)
      );
    }
    let updHostel;
    if (!uploadImage) {
      updHostel = await RoomModel.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
    } else {
      if (!req.file) {
        return next(new ErrorHandler("Image field is required"));
      }
      const myCloud = await cloudinary.v2.uploader.upload(req.file.path);

      const image = {
        url: myCloud.secure_url,
        publicId: myCloud.public_id,
      };
      req.body.image = image;
      updHostel = await RoomModel.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
    }
    res.status(200).json({
      success: true,
      updHostel,
      message: "Hostel room updated successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
