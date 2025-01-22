import { Router } from "express";
import AuthController from "../controllers/authController";
import { authenticateUser } from "../middleware/authmiddleware";


const router = Router();

router.get("/login", AuthController.login);
router.get("/google/callback", AuthController.googleAuth);
router.get("/logout", authenticateUser, AuthController.logout);

export default router;