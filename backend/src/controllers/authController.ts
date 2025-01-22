import { Request, Response } from "express";
import googleClient from "../lib/googleClient";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";

class AuthController {
  static login(req: Request, res: Response) {
    const url = googleClient.generateAuthUrl({
      access_type: "offline", 
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/calendar",
      ],
    });
    res.redirect(url);
  }

  static async googleAuth(req: Request, res: Response) {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: "Authorization code not provided" });
    }

    try {
      // Exchange authorization code for tokens
      const { tokens } = await googleClient.getToken(code as string);
      googleClient.setCredentials(tokens);

      // Verify ID token
      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID!,
      });

      const payload = ticket.getPayload();
      const googleId = payload?.sub;
      const email = payload?.email;

      if (!googleId || !email) {
        return res.status(400).json({ error: "Invalid Google user data" });
      }

      // Check if user exists in the database
      let user = await prisma.user.findUnique({ where: { googleId } });

      if (!user) {
        // Create new user if not found
        user = await prisma.user.create({
          data: {
            googleId,
            email,
            accessToken: tokens.access_token!,
            refreshToken: tokens.refresh_token || null,
          },
        });
      } else {
        await prisma.user.update({
          where: { googleId },
          data: {
            accessToken: tokens.access_token!,
            refreshToken: tokens.refresh_token || user.refreshToken,
          },
        });
      }

      const jwtToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );

      res.cookie("auth_token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });

      if (tokens.refresh_token) {
        res.cookie("refresh_token", tokens.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 100
        });
      }

      const redirectUrl = `http://localhost:5173/dashboard?token=${jwtToken}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(500).json({
        message: "Google authentication failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static logout(req: Request, res: Response) {
    res.clearCookie("auth_token"); 
    res.clearCookie("refresh_token"); 
    return res.status(200).json({
      message: "User has been logged out successfully",
    });
  }
}

export default AuthController;

