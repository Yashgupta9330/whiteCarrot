import { Request, Response } from "express";
import { eventSchema } from "../types/schema";
import EventService from "../services/eventService";

class EventController {
  public async createEvent(req: Request, res: Response) {
    try {
      const parsedEventData = eventSchema.parse(req.body);
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const event = await EventService.createEvent(req.user, parsedEventData);

      return res.status(201).json({
        message: "Event created successfully", 
        event,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  public async deleteEvent(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { eventId } = req.body;
      const response = await EventService.deleteEvent(req.user, eventId);

      return res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  public async getEvents(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const events = await EventService.getEvents(req.user);
      return res.status(200).json(events);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  public async updateEvent(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { eventId, ...updatedData } = req.body;
      const parsedEventData = eventSchema.parse(updatedData);

      const updatedEvent = await EventService.updateEvent(req.user, eventId, parsedEventData);

      return res.status(200).json({
        message: "Event updated successfully",
        event: updatedEvent,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new EventController();
