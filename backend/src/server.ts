import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";
import {prisma} from "./lib/prisma";
import cors from "cors";
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://white-carrot-gamma.vercel.app/"
  ],
  credentials: true  
}));
app.use(cookieParser());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events",eventRoutes);


// Start Server
app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL");
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }
});