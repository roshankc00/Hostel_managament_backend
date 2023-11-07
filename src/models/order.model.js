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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;
