import mongoose from "mongoose";

const rulesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    hostel: {
      type: mongoose.Schema.ObjectId,
      ref: "Hostel",
    },
  },
  { timestamps: true }
);

const rulesModel = mongoose.model("Rule", rulesSchema);

export default rulesModel;
