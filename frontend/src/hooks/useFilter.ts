import { useState, useMemo } from 'react';
import { GoogleCalendarEvent } from '@/types/events';

export const useFilter = (events: GoogleCalendarEvent[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.summary.toLowerCase().includes(searchTerm.toLowerCase());
      let matchesDate = true;
      if (filterDate) {
        const eventDate = event.start.dateTime || event.start.date;
        if (eventDate) {
          matchesDate = eventDate.startsWith(filterDate);
        } else {
          matchesDate = false;
        }
      }

      return matchesSearch && matchesDate;
    });
  }, [events, searchTerm, filterDate]);

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      const dateA = new Date(a.start.dateTime || a.start.date || '');
      const dateB = new Date(b.start.dateTime || b.start.date || '');
      return dateA.getTime() - dateB.getTime();
    });
  }, [filteredEvents]);

  return {
    searchTerm,
    setSearchTerm,
    filterDate,
    setFilterDate,
    filteredEvents: sortedEvents,
  };
};