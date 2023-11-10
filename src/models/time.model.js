import mongoose from "mongoose";

const timeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    category: {
      emum: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ],
    },
    hostel: {
      type: mongoose.Schema.ObjectId,
      ref: "Hostel",
    },
  },
  { timestamps: true }
);

const timeModel = mongoose.model("Time", timeSchema);

export default timeModel;
