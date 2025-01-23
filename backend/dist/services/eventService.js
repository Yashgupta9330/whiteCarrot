"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const googleClient_1 = __importDefault(require("../lib/googleClient"));
const date_1 = require("../lib/date");
class EventService {
    async createEvent(user, eventData) {
        const { summary, startDate, startTime, endDate, endTime, description, location } = eventData;
        const timeZone = "Asia/Kolkata";
        const startDateTime = (0, date_1.convertToUTC)(startDate, startTime, 'Asia/Kolkata');
        const endDateTime = (0, date_1.convertToUTC)(endDate, endTime, 'Asia/Kolkata');
        if (startDateTime >= endDateTime) {
            throw new Error("End time must be after start time.");
        }
        if (startDateTime < new Date()) {
            throw new Error("Start time cannot be in the past.");
        }
        const event = {
            summary,
            description: description || "",
            location: location || "",
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone,
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone,
            },
        };
        googleClient_1.default.setCredentials({ access_token: user.accessToken });
        const calendar = googleapis_1.google.calendar({ version: "v3", auth: googleClient_1.default });
        try {
            const response = await calendar.events.insert({
                calendarId: 'primary',
                requestBody: event,
            });
            if ('data' in response) {
                return response.data;
            }
            else {
                throw new Error('Failed to create event');
            }
        }
        catch (error) {
            throw new Error(`Google API Error: ${error.message}`);
        }
    }
    async deleteEvent(user, eventId) {
        if (!user.accessToken) {
            throw new Error("User not authenticated with Google");
        }
        googleClient_1.default.setCredentials({ access_token: user.accessToken });
        const calendar = googleapis_1.google.calendar({ version: "v3", auth: googleClient_1.default });
        await calendar.events.delete({
            calendarId: "primary",
            eventId,
        });
        return { message: "Event deleted successfully" };
    }
    async updateEvent(user, eventId, eventData) {
        try {
            if (!user.accessToken) {
                throw new Error("User not authenticated with Google");
            }
            googleClient_1.default.setCredentials({ access_token: user.accessToken });
            const calendar = googleapis_1.google.calendar({ version: "v3", auth: googleClient_1.default });
            const timeZone = "Asia/Kolkata";
            const startDateTime = (0, date_1.convertToUTC)(eventData.startDate, eventData.startTime, 'Asia/Kolkata');
            const endDateTime = (0, date_1.convertToUTC)(eventData.endDate, eventData.endTime, 'Asia/Kolkata');
            if (startDateTime >= endDateTime) {
                throw new Error("End time must be after start time.");
            }
            if (startDateTime < new Date()) {
                throw new Error("Start time cannot be in the past.");
            }
            const event = {
                summary: eventData.summary,
                description: eventData.description || "",
                location: eventData.location || "",
                start: {
                    dateTime: startDateTime.toISOString(),
                    timeZone,
                },
                end: {
                    dateTime: endDateTime.toISOString(),
                    timeZone,
                },
            };
            const updatedEventResponse = await calendar.events.update({
                calendarId: "primary",
                eventId,
                requestBody: event,
            });
            console.log("Event updated successfully:", updatedEventResponse);
            return updatedEventResponse.data;
        }
        catch (error) {
            console.error("Error updating event:", error.message || error);
            throw new Error(error.message || "Failed to update event.");
        }
    }
    async getEvents(user) {
        if (!user.accessToken) {
            throw new Error("User not authenticated with Google");
        }
        googleClient_1.default.setCredentials({ access_token: user.accessToken });
        const calendar = googleapis_1.google.calendar({ version: "v3", auth: googleClient_1.default });
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 3);
        yesterday.setHours(0, 0, 0, 0);
        const response = await calendar.events.list({
            calendarId: "primary",
            timeMin: yesterday.toISOString(),
            maxResults: 25,
            singleEvents: true,
            orderBy: "startTime",
        });
        return response.data.items;
    }
}
exports.default = new EventService();
