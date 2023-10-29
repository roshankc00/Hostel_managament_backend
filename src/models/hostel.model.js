import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      city: {
        type: String,
      },
      localLocation: {
        type: String,
      },
    },
    description:{
      type:String,
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "verified"],
      default: "pending",
    },
    thumbnailUrl: {
      url: String,
      publicId: String,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    noOfReviews: {
      type: Number,
      default: 0,
    },
    images: [
      {
        url: {
          type: String,
        },
        publicId: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

hostelSchema.virtual("review", {
  ref: "Review",
  localField: "_id",
  foreignField: "hostel",
  justOne: false,
});

const HostelModel = mongoose.model("Hostel", hostelSchema);

export default HostelModel;



