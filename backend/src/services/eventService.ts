import { google, calendar_v3 } from 'googleapis';
import googleClient from '../lib/googleClient';


type User = {
  id?: string;
  email?: string;
  googleId?: string | null;
  refreshToken?: string | null;
  accessToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

interface EventData {
  summary?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  description?: string;
  location?: string;
}

class EventService {
  async createEvent(user: User, eventData: EventData) {
  
    const { summary, startDate, startTime, endDate, endTime, description, location } = eventData;

    const startDateTime = new Date(`${startDate}T${startTime}:00`);
    const endDateTime = new Date(`${endDate}T${endTime}:00`);

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
        timeZone: "Asia/Kolkata" 
      },
      end: { 
        dateTime: endDateTime.toISOString(), 
        timeZone: "Asia/Kolkata" 
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
    } catch (error:any) {
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
      const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        timeMax: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      });
  
      const events = response.data.items;
      console.log("Retrieved events:", events);
  
      const startDateTime = new Date(`${eventData.startDate}T${eventData.startTime}:00`);
      const endDateTime = new Date(`${eventData.endDate}T${eventData.endTime}:00`);
  
      if (startDateTime >= endDateTime) {
        throw new Error("End time must be after start time.");
      }
  
      if (startDateTime < new Date()) {
        throw new Error("Start time cannot be in the past.");
      }
  
      console.log("Preparing event data...");
  
      const event: calendar_v3.Schema$Event = {
        summary: eventData.summary,
        description: eventData.description || "",
        location: eventData.location || "",
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: "Asia/Kolkata",
        },
      };
  
      console.log("Event data prepared:", event);

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