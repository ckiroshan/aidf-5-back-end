import express from "express";
import { getAllLocations, createLocation, getLocationById, updateLocation, patchLocation, deleteLocation, getAllLocationNames } from "../application/location";
import isAuthenticated from "./middleware/authentication-middleware";

const locationsRouter = express.Router();

locationsRouter
  .route("/")
  .get(getAllLocations)                        // Get All Locations
  .post(isAuthenticated, createLocation);     // Create Location

locationsRouter.route("/names")
  .get(getAllLocationNames); // All locations (from hotels)

locationsRouter
  .route("/:_id")
  .get(getLocationById)                     // Get Location by ID
  .put(updateLocation)                     // Update Location by ID
  .patch(patchLocation)                   // Patch Location by ID
  .delete(deleteLocation);               // Delete Location by ID

export default locationsRouter; 