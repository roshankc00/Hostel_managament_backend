import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    hostel: {
      type: mongoose.Schema.ObjectId,
      ref: "Hostel",
      required: true,
    },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model("Review", reviewSchema);
export default ReviewModel;
