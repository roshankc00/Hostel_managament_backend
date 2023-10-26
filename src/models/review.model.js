import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
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

reviewSchema.index({ hostel: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAvgRating = async function (hostelId) {
  const result = await this.aggregate([
    {
      $match: {
        hostel: hostelId,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: {
          $avg: "$rating",
        },
        noOfReviews: {
          $sum: 1,
        },
      },
    },
  ]);
  try {
    await this.model("Hostel").findOneAndUpdate(
      { _id: hostelId },
      {
        averageRating: result[0]?.averageRating || 0,
        noOfReviews: result[0]?.noOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAvgRating(this.hostel);
});

reviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.constructor.calcAvgRating(this.hostel);
    console.log("ok");
  }
);

const ReviewModel = mongoose.model("Review", reviewSchema);
export default ReviewModel;
