import express from "express";
import { createHotel, getHotelById, updateHotel, patchHotel, deleteHotel, getAllHotelsBySearchQuery, createHotelStripePrice, getHotelsFiltered, getAllHotels } from "../application/hotel";
import isAuthenticated from "./middleware/authentication-middleware";
import isAdmin from "./middleware/authorization-middleware";
import { respondToAIQuery } from "../application/ai";

const hotelsRouter = express.Router();

hotelsRouter
  .route("/")
  .get(getHotelsFiltered)
  .post(isAuthenticated, isAdmin, createHotel);  // Create Hotel

hotelsRouter
  .route("/all")
  .get(getAllHotels);

hotelsRouter.route("/ai").post(respondToAIQuery);

// Get All Hotels By Search Query
hotelsRouter.route("/search").get(getAllHotelsBySearchQuery);

hotelsRouter
  .route("/:_id")
  .get(isAuthenticated, getHotelById) // Get Hotel by ID
  .put(updateHotel)                  // Update Hotel
  .patch(patchHotel)                // Patch Hotel
  .delete(deleteHotel);            // Delete Hotel

hotelsRouter
  .route("/:_id/stripe/price")
  .post(isAuthenticated, isAdmin, createHotelStripePrice);

export default hotelsRouter;
