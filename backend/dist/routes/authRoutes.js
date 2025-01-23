"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const authmiddleware_1 = require("../middleware/authmiddleware");
const router = (0, express_1.Router)();
router.get("/login", authController_1.default.login);
router.get("/google/callback", authController_1.default.googleAuth);
router.get("/logout", authmiddleware_1.authenticateUser, authController_1.default.logout);
exports.default = router;
