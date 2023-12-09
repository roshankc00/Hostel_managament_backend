import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.js";
import RoomModel from "../models/HostelRoom.model.js";
import cloudinary from "../config/cloudinary.config.js";
import HostelModel from "../models/hostel.model.js";
import { deleteImageBulb, uploadImageInBulb } from "../azure/upload.image.js";
import fs from "fs";

export const createHostelRoom = asyncHandler(async (req, res, next) => {
  try {
    const { name, price, description, hostelId, totalVacentSeats, totalSeats } =
      req.body;
    const myCloud = await uploadImageInBulb(req.file.path, next);
    const image = {
      url: myCloud.imageUrl,
      bulbName: myCloud.blobName,
    };
    fs.unlinkSync(req.file.path);

    const hostel = await RoomModel.create({
      name,
      price,
      description,
      hostelId,
      image,
      totalSeats,
      totalVacentSeats,
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
    console.log(room.image.bulbName);
    await RoomModel.findByIdAndDelete(id);
    if (room?.image?.bulbName) {
      await deleteImageBulb(room?.image?.bulbName);
    }

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.log(error);
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
      if (room.image.bulbName) {
        await deleteImageBulb(room.image.bulbName);
      }
      const myCloud = await await uploadImageInBulb(req.file.path, next);

      const image = {
        url: myCloud.imageUrl,
        bulbName: myCloud.blobName,
      };
      req.body.image = image;
      fs.unlinkSync(req.file.path);
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
