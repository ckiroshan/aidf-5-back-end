import "dotenv/config";
import express from "express";
import hotelsRouter from "./api/hotel.js";
import connectDB from "./infrastructure/db.js";
import reviewRouter from "./api/review.js";

const app = express();

// Convert HTTP payloads into JS objects
app.use(express.json());

app.use("/api/hotels", hotelsRouter);
app.use("/api/reviews", reviewRouter);

connectDB();

const PORT = 8080;
app.listen(PORT, () => {
  console.log("Server is listening on PORT: ", PORT);
});
