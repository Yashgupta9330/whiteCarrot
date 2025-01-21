import { Request, Response, NextFunction } from 'express';
import { prisma } from "../lib/prisma";
import jwt from 'jsonwebtoken';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.auth_token; 
    console.log("token ",token)
    if (!token) {
      return res.status(401).json({ message: "Authentication token is required" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };  
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user; 
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Error during authentication", error });
  }
};
