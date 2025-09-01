import express from "express";
import hotelsRouter from "./api/hotel.js";

const app = express();

// Convert HTTP payloads into JS objects
app.use(express.json());

app.use("/api/hotels", hotelsRouter);

const PORT = 8000;
app.listen(PORT, () => {
  console.log("Server is listening on PORT: ", PORT);
});
