import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // Import the toast library
import { EventType, NewEventType } from '@/types/events';
import { EventService } from '@/services/api';
import { handleAuthError } from '@/services/auth';

export const useEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await EventService.list();
      setEvents(data);
    } catch (err: any) {
      if (err.status === 401 || err.status === 404 || err.status === 500) {
        handleAuthError(navigate, err.message);
        return;
      }
      setError('Failed to fetch events');
      toast.error('Failed to fetch events'); // Add toast for fetch errors
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const createEvent = useCallback(
    async (newEvent: NewEventType) => {
      try {
        setLoading(true);
        setError(null);
        await EventService.create(newEvent);
        await fetchEvents();
        toast.success('Event created successfully!'); 
      } catch (err: any) {
        if (err.status === 401 || err.status === 404 || err.status === 500) {
          handleAuthError(navigate, err.message);
          return;
        }
        setError('Failed to create event');
        toast.error('Failed to create event'); 
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchEvents, navigate]
  );

  const updateEvent = useCallback(
    async (id: string, event: NewEventType) => {
      try {
        setLoading(true);
        setError(null);
        console.log('called here');
        await EventService.update(id, event);
        await fetchEvents();
        toast.success('Event updated successfully!'); 
      } catch (err: any) {
        if (err.status === 401 || err.status === 404 || err.status === 500) {
          handleAuthError(navigate, err.message);
          return;
        }
        setError('Failed to update event');
        toast.error('Failed to update event');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchEvents, navigate]
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        await EventService.delete(id);
        await fetchEvents();
        toast.success('Event deleted successfully!');
      } catch (err: any) {
        if (err.status === 401 || err.status === 404 || err.status === 500) {
          handleAuthError(navigate, err.message);
          return;
        }
        setError('Failed to delete event');
        toast.error('Failed to delete event'); 
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchEvents, navigate]
  );

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
