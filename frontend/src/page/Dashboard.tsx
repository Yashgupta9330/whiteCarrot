import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";
import "jspdf-autotable";
import { ChevronLeft, ChevronRight, Search, Moon, Sun, Edit, Trash2, Plus, Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EventType } from "../types/events"; 
import jsPDF from "jspdf";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);

  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  useEffect(() => {
    const sortedEvents = [...events].sort((a: EventType, b: EventType) => {
      const dateA = new Date(a.start.dateTime); 
      const dateB = new Date(b.start.dateTime); 
      return dateB.getTime() - dateA.getTime(); 
    });
    setEvents(sortedEvents);
  }, []);

  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        event.summary.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterDate === "" || event.start.dateTime.startsWith(filterDate))
    );
    setFilteredEvents(filtered);
  }, [searchTerm, filterDate, events]);

  const handleEdit = (event: EventType) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleDelete = (event: EventType) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setEvents(events.filter((e) => e.id !== selectedEvent?.id));
    setIsDeleteDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newEvent: EventType = {
      id: selectedEvent ? selectedEvent.id : Date.now().toString(),
      summary: formData.get("summary") as string,
      start: { dateTime: formData.get("startDateTime") as string },
      end: { dateTime: formData.get("endDateTime") as string },
      description: formData.get("description") as string,
      location: formData.get("location") as string,
    };

    if (selectedEvent) {
      setEvents(events.map((e) => (e.id === selectedEvent.id ? newEvent : e)));
    } else {
      setEvents([...events, newEvent]);
    }

    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Event List", 14, 15);
    doc.autoTable({
      head: [["Title", "Start Date", "End Date", "Description", "Location"]],
      body: filteredEvents.map((event) => [
        event.summary,
        event.start.dateTime,
        event.end.dateTime,
        event.description || "",
        event.location || "",
      ]),
    });
    doc.save("events.pdf");
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Title,Start Date,End Date,Description,Location\n" +
      filteredEvents
        .map((event) =>
          `${event.summary},${event.start.dateTime},${event.end.dateTime},${event.description || ""},${event.location || ""}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "events.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 w-full">
      <motion.header
        className="bg-white dark:bg-gray-800 shadow-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 sm:mb-0">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-600" />
              )}
            </Button>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              className="text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900"
            >
              Logout
            </Button>
          </div>
        </div>
      </motion.header>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {analytics?.map((item, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-600 dark:text-gray-300">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold" style={{ color: item.color }}>
                  {item.value}
                </p>
              </CardContent>
            </Card>
          ))}
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-600 dark:text-gray-300">Event Types</CardTitle>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {eventTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <CardTitle className="text-2xl text-indigo-600 dark:text-indigo-400">Calendar Events</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={exportToPDF}>Export to PDF</DropdownMenuItem>
                    <DropdownMenuItem onClick={exportToCSV}>Export to CSV</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-6">
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mb-4 sm:mb-0">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    type="date"
                    className="w-full sm:w-auto border-indigo-600 dark:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={() => setFilterDate("")}
                    className="w-full sm:w-auto text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                  >
                    Today
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    <Input
                      placeholder="Search events"
                      className="pl-8 w-full border-indigo-600 dark:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-full sm:w-[180px] border-indigo-600 dark:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="rounded-md border border-indigo-200 dark:border-indigo-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden shadow-sm">
                      <table className="min-w-full divide-y divide-indigo-200 dark:divide-indigo-700">
                        <thead className="bg-indigo-50 dark:bg-indigo-900">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider"
                            >
                              Event
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider"
                            >
                              Time
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider"
                            >
                              Type
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider"
                            >
                              Description
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider"
                            >
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-indigo-200 dark:divide-indigo-700">
                          {filteredEvents.map((event, index) => (
                            <motion.tr
                              key={event.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                                  {event.title}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600 dark:text-gray-300">{event.date}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600 dark:text-gray-300">{event.time}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${event.type === "Work"
                                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-indigo-100"
                                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100"
                                    }`}
                                >
                                  {event.type}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                                  {event.description}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mr-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                                  onClick={() => handleEdit(event)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900"
                                  onClick={() => handleDelete(event)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event "{selectedEvent?.title}" from your
              calendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? "Edit Event" : "Create Event"}</DialogTitle>
            <DialogDescription>
              {selectedEvent ? "Edit the details of your event." : "Add a new event to your calendar."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEventSubmit} className="space-y-4">
            <Input
              placeholder="Event Title"
              name="title"
              defaultValue={selectedEvent?.title || ""}
              className="border-indigo-600 dark:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <Input
              type="date"
              name="date"
              defaultValue={selectedEvent?.date || ""}
              className="border-indigo-600 dark:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <Input
              type="time"
              name="time"
              defaultValue={selectedEvent?.time.split(" - ")[0] || ""}
              className="border-indigo-600 dark:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <Select name="type" defaultValue={selectedEvent?.type.toLowerCase() || ""}>
              <SelectTrigger className="border-indigo-600 dark:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Event Description"
              name="description"
              defaultValue={selectedEvent?.description || ""}
              className="border-indigo-600 dark:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            />
            <DialogFooter>
              <Button
                type="submit"
                className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                {selectedEvent ? "Update Event" : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Button
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600"
        onClick={() => {
          setSelectedEvent(null)
          setIsEventDialogOpen(true)
        }}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
} 


