import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;
