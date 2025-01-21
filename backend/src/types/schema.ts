import { z } from 'zod';

export const eventSchema = z.object({
  summary: z.string(),
  startDate: z.string(),
  startTime: z.string(),
  endDate: z.string(),
  endTime: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
});

export const eventUpdateSchema = z.object({
  eventId: z.string(),
  summary: z.string().optional(),
  startDate: z.string().optional(),
  startTime: z.string().optional(),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
});


export const User = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  googleId: z.string().uuid().optional(),  
  refreshToken: z.string().optional(),
  accessToken: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
