import express from 'express';
import { connectDb } from "./src/db/Db.js";
import dotenv from 'dotenv';
import cors from "cors"

// Importing routes
import userRouter from './src/routes/user.routes.js';
import authRouter from "./src/routes/auth.routes.js"
import errorHandler from './src/middlewares/errorHandler.js';
import listingRouter from './src/routes/listing.routes.js';
import cookieParser from 'cookie-parser';


const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "*",           // Allows requests from any site
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


const PORT = process.env.PORT || 4000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("error during using connectDb :", error);
  });


  // Using routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use("/api/listing", listingRouter)

app.use(errorHandler);