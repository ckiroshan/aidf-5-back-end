import Review from "../infrastructure/entities/Review.js";
import Hotel from "../infrastructure/entities/Hotel.js";
import ValidationError from "../domain/errors/validation-error.js";
import NotFoundError from "../domain/errors/not-found-error.js";

const createReview = async (req, res, next) => {
  try {
    const reviewData = req.body;
    if (!reviewData.rating || !reviewData.comment || !reviewData.hotelId) {
      throw new ValidationError("Rating, comment, and hotelId are required");
    }

    const hotel = await Hotel.findById(reviewData.hotelId);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }

    const review = await Review.create({
      rating: reviewData.rating,
      comment: reviewData.comment,
    });

    hotel.reviews.push(review._id);
    await hotel.save();
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

const getReviewsForHotel = async (req, res, next) => {
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
