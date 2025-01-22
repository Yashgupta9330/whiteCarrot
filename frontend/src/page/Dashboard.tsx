import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Plus } from 'lucide-react';
import { Header } from '@/components/common/Header';
import { EventTable } from '@/components/events/eventTable';
import { EventDialog } from '@/components/events/eventDialog';
import { DeleteDialog } from '@/components/events/deleteDialog';
import { FilterBar } from '@/components/events/filterBar';
import { useEvents } from '@/hooks/useEvents';
import { useFilter } from '@/hooks/useFilter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventType, NewEventType } from '@/types/events';

export default function Dashboard() {
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const navigate=useNavigate();

  const {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useEvents();

  const {
    searchTerm,
    setSearchTerm,
    filterDate,
    setFilterDate,
    filteredEvents,
  } = useFilter(events);
  

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      fetchEvents(); 
      navigate("/dashboard"); 
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token){
      navigate('/');
    }
  }, [navigate]);

  useEffect(()=>{
   fetchEvents()
  },[])

  const handleEventSubmit = async (newEvent: NewEventType) => {
    if (selectedEvent) {
        await updateEvent(selectedEvent.id, newEvent);
    } else {
        await createEvent(newEvent);
    }
    setSelectedEvent(null);
  };

  const handleEdit = (event: EventType) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleDelete = (event: EventType) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedEvent) {
      await deleteEvent(selectedEvent.id);
      setIsDeleteDialogOpen(false);
      setSelectedEvent(null);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={fetchEvents} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 transition-colors duration-500">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-600 dark:text-indigo-400">Calendar Events</CardTitle>
          </CardHeader>
          <CardContent>
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterDate={filterDate}
              onFilterDateChange={setFilterDate}
            />

            <EventTable
              events={filteredEvents}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>

        <EventDialog
          open={isEventDialogOpen}
          onOpenChange={setIsEventDialogOpen}
          selectedEvent={selectedEvent}
          onSubmit={handleEventSubmit}
        />

        <DeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          selectedEvent={selectedEvent}
          onConfirm={confirmDelete}
        />

        <Button
          className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600"
          onClick={() => {
            setSelectedEvent(null);
            setIsEventDialogOpen(true);
          }}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </main>
    </div>
  );
}
