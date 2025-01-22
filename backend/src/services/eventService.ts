import { google, calendar_v3 } from 'googleapis';
import googleClient from '../lib/googleClient';
import { convertToUTC } from '../lib/date';
import { EventData, User } from '../types/event';



class EventService {
  async createEvent(user: User, eventData: EventData) {

    const { summary, startDate, startTime, endDate, endTime, description, location } = eventData;

    const timeZone = "Asia/Kolkata";
    const startDateTime = convertToUTC(startDate, startTime, 'Asia/Kolkata');
    const endDateTime = convertToUTC(endDate, endTime, 'Asia/Kolkata');

    if (startDateTime >= endDateTime) {
      throw new Error("End time must be after start time.");
    }

    if (startDateTime < new Date()) {
      throw new Error("Start time cannot be in the past.");
    }
    const event: calendar_v3.Schema$Event = {
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

    googleClient.setCredentials({ access_token: user.accessToken });

    const calendar = google.calendar({ version: "v3", auth: googleClient });

    try {
      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });

      if ('data' in response) {
        return response.data;
      } else {
        throw new Error('Failed to create event');
      }
    } catch (error: any) {
      throw new Error(`Google API Error: ${error.message}`);
    }
  }

  async deleteEvent(user: User, eventId: string) {
    if (!user.accessToken) {
      throw new Error("User not authenticated with Google");
    }

    googleClient.setCredentials({ access_token: user.accessToken });

    const calendar = google.calendar({ version: "v3", auth: googleClient });

    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });

    return { message: "Event deleted successfully" };
  }

  async updateEvent(user: User, eventId: string, eventData: EventData) {
    try {
      if (!user.accessToken) {
        throw new Error("User not authenticated with Google");
      }
      googleClient.setCredentials({ access_token: user.accessToken });
      const calendar = google.calendar({ version: "v3", auth: googleClient });
      const timeZone = "Asia/Kolkata";
      const startDateTime = convertToUTC(eventData.startDate, eventData.startTime, 'Asia/Kolkata');
      const endDateTime = convertToUTC(eventData.endDate, eventData.endTime, 'Asia/Kolkata');
      if (startDateTime >= endDateTime) {
        throw new Error("End time must be after start time.");
      }
      if (startDateTime < new Date()) {
        throw new Error("Start time cannot be in the past.");
      }
      const event: calendar_v3.Schema$Event = {
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
    catch (error: any) {
      console.error("Error updating event:", error.message || error);
      throw new Error(error.message || "Failed to update event.");
    }
  }

  async getEvents(user: User) {
    if (!user.accessToken) {
      throw new Error("User not authenticated with Google");
    }
    googleClient.setCredentials({ access_token: user.accessToken });
    const calendar = google.calendar({ version: "v3", auth: googleClient });
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

export default new EventService();