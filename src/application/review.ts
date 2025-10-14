import { Request, Response, NextFunction } from "express";
import Review from "../infrastructure/entities/Review";
import Hotel from "../infrastructure/entities/Hotel";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import { clerkClient, getAuth } from "@clerk/express";
import UnauthorizedError from "../domain/errors/unauthorized-error";

const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviewData = req.body;
    if (!reviewData.rating || !reviewData.comment || !reviewData.hotelId) {
      throw new ValidationError("Rating, comment, and hotelId are required");
    }

    const hotel = await Hotel.findById(reviewData.hotelId);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }

    const { userId } = getAuth(req);
    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    // Fetch Clerk user info
    const clerkUser = await clerkClient.users.getUser(userId);

    const review = await Review.create({
      rating: reviewData.rating,
      comment: reviewData.comment,
      userId,
      fullName: clerkUser.fullName
    });

    hotel.reviews.push(review._id);
    await hotel.save();
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

const getReviewsForHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotelId = req.params.hotelId;
    const hotel = await Hotel.findById(hotelId).populate("reviews");
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }

    res.status(200).json(hotel.reviews);
  } catch (error) {
    next(error);
  }
};

export { createReview, getReviewsForHotel };
