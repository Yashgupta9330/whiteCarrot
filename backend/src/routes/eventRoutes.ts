import { Router } from "express";
import EventController from "../controllers/eventController";
import { authenticateUser } from "../middleware/authmiddleware";

const router = Router();

router.post("/create", authenticateUser, EventController.createEvent);
router.delete("/delete", authenticateUser, EventController.deleteEvent);
router.get("/list", authenticateUser, EventController.getEvents);
router.put("/update", authenticateUser, EventController.updateEvent);

export default router;
