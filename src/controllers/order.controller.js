import asyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler.js";
import OrderModel from "../models/order.model.js";
import RoomModel from "../models/HostelRoom.model.js";
import { sendMail } from "../utils/sendmail.js";
import HostelModel from "../models/hostel.model.js";

export const createOrder = asyncHandler(async (req, res, next) => {
  try {
    const { roomId, phone } = req.body;
    const room = await RoomModel.findById(roomId).populate("hostelId");
    if (!room) {
      return next(new ErrorHandler("Unable to find this room "));
    }

    const newOrder = await OrderModel.create({
      hostel: room.hostelId.toString(),
      room: roomId,
      phone,
      user: req.user._id,
    });

    const hostel = await HostelModel.findById(
      room.hostelId.toString()
    ).populate("user");

    const html = `<div> <p> <h1> Hello ${req.user.name} has placed his order for ${room.name}</h1>  <br/>  
  If you havent requested for token  then please kindlty ignore this mail sry  </p> </div>`;
    try {
      await sendMail({
        email: hostel.user.email,
        subject: `${req.user.name} placed an order for you`,
        html,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }

    res.status(200).json({
      success: true,
      message: "Order Created successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const findSingleOrder = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const isValid = validateMongodbId(id);
    if (!isValid) {
      return next(new ErrorHandler("The id is not valid", 400));
    }
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      return next(new ErrorHandler("order not found", 404));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getAllTheOrderOfHostel = asyncHandler(async (req, res, next) => {
  try {
    const allOrders = await OrderModel.find({
      hostel: req.body.hostelId,
    })
      .populate("user")
      .populate("room");
    res.status(200).json({
      success: true,
      allOrders,
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});

export const getAllTheOrdersForSuperadmin = asyncHandler(
  async (req, res, next) => {
    try {
      const allOrders = await OrderModel.find()
        .populate("user")
        .populate("room");

      res.status(200).json({
        success: true,
        allOrders,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

export const acceptOrderHandler = asyncHandler(async (req, res, next) => {
  try {
    const { roomId, orderId } = req.body;
    if (!orderId) {
      return next(new ErrorHandler("Order id field is required"));
    }
    const orderExist = await OrderModel.findById(orderId);
    if (!orderExist) {
      return next(new ErrorHandler("order with this id doesnt exist ", 404));
    }
    const room = await RoomModel.findById(roomId);
    if (!room) {
      return next(
        new ErrorHandler("Room doesnt exist or room has been deleted", 404)
      );
    }

    const order = await OrderModel.findById(orderId)
      .populate("hostel")
      .populate("user");
    if (!order) {
      return next(new ErrorHandler("Order with thisw id doesnt exist ", 404));
    }

    const html = `<div> <p> <h1> Hello ${order.user.name} </h1>  
  <h3> Your Order has been accepted successfully by ${order.hostel.name}</h3>
  
  If you havent requested for token  then please kindlty ignore this mail sry  </p> </div>`;
    try {
      await sendMail({
        email: order.user.email,
        subject: `Accepted you order by ${order.hostel.name}`,
        html,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }

    room.totalVacentSeats = room.totalVacentSeats - 1;
    await room.save();
    await OrderModel.findByIdAndDelete(orderId);
    res.status(200).json({
      success: true,
      message: "order accepted successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
export const rejectOrderHandler = asyncHandler(async (req, res, next) => {
  try {
    const { roomId, orderId } = req.body;
    if (!orderId) {
      return next(new ErrorHandler("Order id field is required", 404));
    }
    const order = await OrderModel.findById(orderId)
      .populate("hostel")
      .populate("user");
    if (!order) {
      return next(new ErrorHandler("Order with thisw id doesnt exist ", 404));
    }

    const html = `<div> <p> <h1> Hello ${order?.user?.name} </h1>  
    <h3> Your Order has been Rejected by ${order?.hostel?.name}</h3>
    
    If you havent requested for token  then please kindlty ignore this mail sry  </p> </div>`;
    try {
      await sendMail({
        email: order?.user?.email,
        subject: "Rejected you order",
        html,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
    await OrderModel.findByIdAndDelete(orderId);
    res.status(200).json({
      success: true,
      message: "Order rejected successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
