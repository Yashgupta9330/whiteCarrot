
  
  export interface NewEventType {
    summary: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    description: string;
    location: string;
  }
  
  export interface EventType {
    kind: string;
    etag: string;
    id: string;
    description:string;
    status: string;
    htmlLink: string;
    created: string;
    updated: string;
    summary: string;
    creator: GoogleEventPerson;
    organizer: GoogleEventPerson;
    start: GoogleDateTime;
    end: GoogleDateTime;
    recurringEventId?: string;
    originalStartTime?: GoogleDateTime;
    transparency?: string;
    visibility?: string;
    iCalUID: string;
    sequence: number;
    reminders: {
      useDefault: boolean;
    };
  }
  

  export interface GoogleDateTime {
    date?: string;
    dateTime?: string;
    timeZone?: string;
  }
  
  export interface GoogleEventPerson {
    email: string;
    self?: boolean;
  }
  
  export interface GoogleCalendarEvent {
    kind: string;
    etag: string;
    id: string;
    status: string;
    description:string;
    htmlLink: string;
    created: string;
    updated: string;
    summary: string;
    creator: GoogleEventPerson;
    organizer: GoogleEventPerson;
    start: GoogleDateTime;
    end: GoogleDateTime;
    recurringEventId?: string;
    originalStartTime?: GoogleDateTime;
    transparency?: string;
    visibility?: string;
    iCalUID: string;
    sequence: number;
    reminders: {
      useDefault: boolean;
    };
  }
  