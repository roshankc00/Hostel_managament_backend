import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    totalVacentSeats: {
      type: Number,
      required: true,
    },

    price: {
      type: String,
      required: true,
    },
    image: {
      url: {
        type: String,
      },
      bulbName: {
        type: String,
      },
    },
    description: {
      type: String,
      required: true,
    },
    hostelId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const RoomModel = mongoose.model("Room", roomSchema);

export default RoomModel;
