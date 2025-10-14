import express from "express";
import { createReview, getReviewsForHotel } from "../application/review";
import isAuthenticated from "./middleware/authentication-middleware";

const reviewRouter = express.Router();

reviewRouter.post("/", isAuthenticated, createReview);  // Create Review
reviewRouter.get("/hotel/:hotelId", isAuthenticated, getReviewsForHotel);  // Get All Reviews

export default reviewRouter;
