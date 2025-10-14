import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  userId: { type: String, required: true }, // Clerk user ID
  fullName: { type: String },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
