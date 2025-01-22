export type User = {
    id?: string;
    email?: string;
    googleId?: string | null;
    refreshToken?: string | null;
    accessToken?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  };
  
export interface EventData {
    summary?: string;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
    description?: string;
    location?: string;
  }