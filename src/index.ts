import "dotenv/config";
import express from "express";
import cors from "cors";
import hotelsRouter from "./api/hotel";
import connectDB from "./infrastructure/db";
import reviewRouter from "./api/review";
import locationsRouter from "./api/location";
import { clerkMiddleware } from "@clerk/express";
import globalErrorHandlingMiddleware from "./api/middleware/global-error-handling-middleware";

const app = express();

// Convert HTTP payloads into JS objects
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.use(clerkMiddleware());

// Routes
app.use("/api/hotels", hotelsRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/locations", locationsRouter);
app.use(globalErrorHandlingMiddleware);

connectDB();

const PORT = 8080;
app.listen(PORT, () => {
  console.log("Server is listening on PORT: ", PORT);
});
