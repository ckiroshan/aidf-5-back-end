import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stripePriceId: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  reviews: { type: [mongoose.Schema.Types.ObjectId], ref: "Review", default: [] },
  embedding: { type: [Number], default: [] },
});

// Index for better query performance
hotelSchema.index({ location: 1 });
hotelSchema.index({ price: 1 });
hotelSchema.index({ rating: -1 });
hotelSchema.index({ name: 1 });

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
