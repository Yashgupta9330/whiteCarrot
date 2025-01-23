"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../types/schema");
const eventService_1 = __importDefault(require("../services/eventService"));
class EventController {
    async createEvent(req, res) {
        try {
            const parsedEventData = schema_1.eventSchema.parse(req.body);
            if (!req.user) {
                return res.status(401).json({ message: "User not authenticated" });
            }
            const event = await eventService_1.default.createEvent(req.user, parsedEventData);
            return res.status(201).json({
                message: "Event created successfully",
                event,
            });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async deleteEvent(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "User not authenticated" });
            }
            const { eventId } = req.body;
            const response = await eventService_1.default.deleteEvent(req.user, eventId);
            return res.status(200).json(response);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async getEvents(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "User not authenticated" });
            }
            const events = await eventService_1.default.getEvents(req.user);
            return res.status(200).json(events);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    async updateEvent(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "User not authenticated" });
            }
            const { eventId, event } = req.body;
            console.log("eventId:", eventId);
            console.log("event:", event);
            const parsedEventData = schema_1.eventSchema.parse(event);
            console.log("passed parsing");
            const updatedEvent = await eventService_1.default.updateEvent(req.user, eventId, parsedEventData);
            return res.status(200).json({
                message: "Event updated successfully",
                event: updatedEvent,
            });
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}
exports.default = new EventController();
