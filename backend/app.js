// const express = require('express');
// const jwt = require('jsonwebtoken');
// // const mongoose = './database/connectDB'
// const app = express()
// const port = 3000

// // mongodb connection code below
// const mongoose = require ('mongoose')
// mongoose.Promise = global.Promise

// const mongo_link =  "mongodb+srv://sahilthete:sahilthete@cluster0.qr6wg9l.mongodb.net/"

// mongoose.connect(mongo_link)
//     .then(() => console.log('Database Connected'))
//     .catch((error) => console.log(error))

// function generateAccessToken(user) {
//         const payload = {
//           id: user.id,
//           email: user.email
//         };
        
//         const secret = 'your-secret-key';
//         const options = { expiresIn: '1h' };
      
//         return jwt.sign(payload, secret, options);
//       }

// function verifyAccessToken(token) {
//         const secret = 'your-secret-key';
      
//         try {
//           const decoded = jwt.verify(token, secret);
//           return { success: true, data: decoded };
//         } catch (error) {
//           return { success: false, error: error.message };
//         }
//       }
// // express api below
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

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