"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleClient_1 = __importDefault(require("../lib/googleClient"));
const prisma_1 = require("../lib/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    static login(req, res) {
        const url = googleClient_1.default.generateAuthUrl({
            access_type: "offline",
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
                "https://www.googleapis.com/auth/calendar",
            ],
        });
        res.redirect(url);
    }
    static async googleAuth(req, res) {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ error: "Authorization code not provided" });
        }
        try {
            // Exchange authorization code for tokens
            const { tokens } = await googleClient_1.default.getToken(code);
            googleClient_1.default.setCredentials(tokens);
            // Verify ID token
            const ticket = await googleClient_1.default.verifyIdToken({
                idToken: tokens.id_token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const googleId = payload?.sub;
            const email = payload?.email;
            if (!googleId || !email) {
                return res.status(400).json({ error: "Invalid Google user data" });
            }
            // Check if user exists in the database
            let user = await prisma_1.prisma.user.findUnique({ where: { googleId } });
            if (!user) {
                // Create new user if not found
                user = await prisma_1.prisma.user.create({
                    data: {
                        googleId,
                        email,
                        accessToken: tokens.access_token,
                        refreshToken: tokens.refresh_token || null,
                    },
                });
            }
            else {
                await prisma_1.prisma.user.update({
                    where: { googleId },
                    data: {
                        accessToken: tokens.access_token,
                        refreshToken: tokens.refresh_token || user.refreshToken,
                    },
                });
            }
            const jwtToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
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
            const redirectUrl = `https://white-carrot-gamma.vercel.app/dashboard?token=${jwtToken}`;
            res.redirect(redirectUrl);
        }
        catch (error) {
            console.error("Authentication error:", error);
            res.status(500).json({
                message: "Google authentication failed",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    static logout(req, res) {
        res.clearCookie("auth_token");
        res.clearCookie("refresh_token");
        return res.status(200).json({
            message: "User has been logged out successfully",
        });
    }
}
exports.default = AuthController;
