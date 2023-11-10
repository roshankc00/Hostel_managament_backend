import mongoose from "mongoose";

const rulesAndTimeSchema = new mongoose.Schema(
  {
    rulesAndRegulation: [
      {
        type: String,
      },
    ],
    timeSchedule: {
      time: { type: String },
      title: { type: String },
    },

    hostel: {
      type: mongoose.Schema.ObjectId,
      ref: "Hostel",
    },
  },
  { timestamps: true }
);

const rulesAndTimeModel = mongoose.model("RulesAndTime", rulesAndTimeSchema);

export default rulesAndTimeModel;
