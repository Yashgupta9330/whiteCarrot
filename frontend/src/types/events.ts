
  
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
    id: string;
    summary: string;
    start: { dateTime: string };
    end: { dateTime: string };
    description?: string;
    location?: string;
  }
  