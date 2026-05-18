const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const cors = require("cors"); // Import the CORS middleware
require("dotenv").config();

const app = express();
const PORT = 3001;

mongoose
  .connect("mongodb+srv://sahilthete:sahilthete@cluster0.qr6wg9l.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth", authRoutes); // All the routes defined in auth.js will be prefixed with /api/auth

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});