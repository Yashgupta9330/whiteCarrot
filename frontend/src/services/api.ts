import { EventType, NewEventType } from '@/types/events';
import {axiosInstance, getAuthHeaders } from './apiConnector';

export const EventService = {
  list: async (): Promise<EventType[]> => {
    try {
      const response = await axiosInstance.get('/api/events/list', {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Failed to fetch events',
        status: error.response?.status
      };
    }
  },

  create: async (event: NewEventType): Promise<EventType> => {
    try {
      const response = await axiosInstance.post('/api/events/create', event, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Failed to create event',
        status: error.response?.status
      };
    }
  },

  update: async (id: string, event: NewEventType): Promise<EventType> => {
    try {
      const response = await axiosInstance.put(
        `/api/events/update`, 
        {
          eventId: id,
          event: event
        },
        {
          headers: getAuthHeaders()
        }
      );
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Failed to update event',
        status: error.response?.status
      };
    }
  },  

  delete: async (eventId: string): Promise<void> => {
    try {
      await axiosInstance.delete('/api/events/delete', {
        headers: getAuthHeaders(),
        data: { eventId }
      });
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Failed to delete event',
        status: error.response?.status
      };
    }
  }
};
