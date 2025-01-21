import { Request, Response } from "express";
import googleClient from "../lib/googleClient";
import {prisma} from "../lib/prisma";
import jwt from "jsonwebtoken";

class AuthController {
  static login(req: Request, res: Response) {
    const url = googleClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
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

    if(!code){
      return res.status(400).json({ error: "Authorization code not provided" });
    }

    try {
      const { tokens } = await googleClient.getToken(code as string);
      googleClient.setCredentials(tokens);
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
      let user = await prisma.user.findUnique({ where: { googleId } });
      if (!user) {
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
        { expiresIn: '24h' }  
      );
      res.cookie('auth_token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  
        maxAge: 86400000,  
      });
      res.cookie('refresh_token', tokens.refresh_token!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 86400000,  
      });
      res.redirect('http://localhost:5173/dashboard');
    } 
    catch (error) {
      console.error("Authentication error:", error);
      res.status(500).json({ message: "Google authentication failed", error });
    }
  }
}

export default AuthController;