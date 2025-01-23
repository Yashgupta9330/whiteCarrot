"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = __importDefault(require("../controllers/eventController"));
const authmiddleware_1 = require("../middleware/authmiddleware");
const router = (0, express_1.Router)();
router.post("/create", authmiddleware_1.authenticateUser, eventController_1.default.createEvent);
router.delete("/delete", authmiddleware_1.authenticateUser, eventController_1.default.deleteEvent);
router.get("/list", authmiddleware_1.authenticateUser, eventController_1.default.getEvents);
router.put("/update", authmiddleware_1.authenticateUser, eventController_1.default.updateEvent);
exports.default = router;
