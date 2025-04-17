import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import { connectDB } from "./config/db";
import loanRoutes from "./routes/loanRoutes";
import authRoutes from "./routes/authRoutes";
import mfRoutes from "./routes/mfRoutes"
import errorMiddleware from "./middleware/errorMiddleware";
import AppError from "./utils/AppError";


dotenv.config();


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use("/api/loans", loanRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/mf",mfRoutes)


app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});


app.use(errorMiddleware);


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer(); 