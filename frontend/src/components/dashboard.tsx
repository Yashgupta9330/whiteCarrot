/*
import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { FaFileCsv, FaFilePdf, FaSignOutAlt, FaPlus } from "react-icons/fa";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { debounce } from "lodash";

const Dashboard = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState({
    totalEventsThisMonth: 0,
    avgDuration: 0,
    busiestDay: "N/A",
  });
  const [filterDate, setFilterDate] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newEvent, setNewEvent] = useState({
    summary: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    description: "",
    location: "",
  });
  const [editingEvent, setEditingEvent] = useState(null);

  // Fetch events when the component mounts or the token changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchEvents(token);

    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        resetForm();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigate]);

  // Fetch events from the API
  const fetchEvents = async (token: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/events/getevent`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const events = response.data.sort(
        (a, b) => new Date(b.start.dateTime) - new Date(a.start.dateTime)
      );
      setEvents(events);
      setFilteredEvents(events);
      calculateInsights(events);
    } catch (error) {
      toast.error("Failed to fetch events. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate insights (total events, avg duration, busiest day)
  const calculateInsights = (events) => {
    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    const eventsThisMonth = events.filter((event) => {
      const eventDate = new Date(event.start.dateTime);
      return eventDate.getMonth() === thisMonth && eventDate.getFullYear() === thisYear;
    });

    const durations = events.map(
      (event) =>
        (new Date(event.end.dateTime) - new Date(event.start.dateTime)) / (60 * 1000) // Duration in minutes
    );

    const busiestDays = events.reduce((acc, event) => {
      const day = new Date(event.start.dateTime).toLocaleDateString();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    const busiestDay = Object.keys(busiestDays).sort(
      (a, b) => busiestDays[b] - busiestDays[a]
    )[0];

    setInsights({
      totalEventsThisMonth: eventsThisMonth.length,
      avgDuration: durations.length
        ? (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2)
        : 0,
      busiestDay: busiestDay || "N/A",
    });
  };

  // Filter events by date
  const filterByDate = (date) => {
    if (!date) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter((event) => {
      const eventDate = new Date(event.start.dateTime).toISOString().split("T")[0];
      return eventDate === date;
    });

    setFilteredEvents(filtered);
  };

  // Debounced filter function to avoid excessive re-renders
  const debounceFilter = useCallback(
    debounce((date) => filterByDate(date), 300),
    []
  );

  // Reset form state
  const resetForm = () => {
    setIsFormVisible(false);
    setEditingEvent(null);
    setNewEvent({
      summary: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      description: "",
      location: "",
    });
  };

  // Handle input change for the form
  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  // Create or update event
  const handleSubmitEvent = async (e) => {
    e.preventDefault();

    const startDateTime = new Date(`${newEvent.startDate}T${newEvent.startTime}`);
    const endDateTime = new Date(`${newEvent.endDate}T${newEvent.endTime}`);

    if (startDateTime >= endDateTime) {
      toast.error("End time must be after start time.");
      return;
    }

    if (new Date(newEvent.endDate) < new Date(newEvent.startDate)) {
      toast.error("End date must be after start date.");
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      if (editingEvent) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/events/updateevent`,
          { ...newEvent, eventId: editingEvent.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Event updated successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/events/createevent`,
          newEvent,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Event created successfully!");
      }
      fetchEvents(token);
      resetForm();
    } catch (error) {
      toast.error("Failed to save the event. Please try again.");
      console.error(error);
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/events/deleteevent`, {
        data: { eventId },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Event deleted successfully!");
      fetchEvents(token);
    } catch (error) {
      toast.error("Failed to delete the event.");
      console.error(error);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    if (events.length === 0) {
      toast.error("No events available for export.");
      return;
    }
    const csvData = events.map((event) => ({
      Name: event.summary,
      Start: new Date(event.start.dateTime).toLocaleString(),
      End: new Date(event.end.dateTime).toLocaleString(),
      Description: event.description || "No description provided",
      Location: event.location || "No location specified",
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "events.csv");
  };

  // Export to PDF
  const exportToPDF = () => {
    if (events.length === 0) {
      toast.error("No events available for export.");
      return;
    }
    const doc = new jsPDF();
    doc.text("Event List", 10, 10);
    events.forEach((event, index) => {
      doc.text(
        `${index + 1}. ${event.summary}, ${new Date(
          event.start.dateTime
        ).toLocaleString()} - ${new Date(event.end.dateTime).toLocaleString()}`,
        10,
        20 + index * 10
      );
    });
    doc.save("events.pdf");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <ToastContainer />
      <header className="main-header">
        <h2>Events Calendar</h2>
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt /> Logout
        </button>
      </header>

      <main className="main-content">
        <section className="calendar-section">
          {isFormVisible && (
            <div className="modal-background">
              <form
                ref={formRef}
                onSubmit={handleSubmitEvent}
                className="event-form-card"
              >
                <h3>{editingEvent ? "Edit Event" : "Create Event"}</h3>
                <input
                  type="text"
                  name="summary"
                  placeholder="Event Name"
                  value={newEvent.summary}
                  onChange={handleChange}
                  required
                />
                <div className="input-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={newEvent.startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="time"
                    name="startTime"
                    value={newEvent.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={newEvent.endDate}
                    min={newEvent.startDate}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="time"
                    name="endTime"
                    value={newEvent.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={newEvent.description}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={newEvent.location}
                  onChange={handleChange}
                />
                <button type="submit">
                  {editingEvent ? "Update Event" : "Create Event"}
                </button>
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
              </form>
            </div>
          )}

          <div className="insights">
            <h3>Event Insights</h3>
            <p>Total Events This Month: {insights.totalEventsThisMonth}</p>
            <p>Average Duration: {insights.avgDuration} minutes</p>
            <p>Busiest Day: {insights.busiestDay}</p>
          </div>
          <div className="controls">
            <div className="export-buttons">
              <button onClick={exportToCSV}>
                <FaFileCsv /> Export to CSV
              </button>
              <button onClick={exportToPDF}>
                <FaFilePdf /> Export to PDF
              </button>
            </div>

            <h3>
              Filter By Date :
              <input
                type="date"
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  debounceFilter(e.target.value);
                }}
                placeholder="Filter by date"
              />
            </h3>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <table className="events-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td>{event.summary}</td>
                    <td>{new Date(event.start.dateTime).toLocaleString()}</td>
                    <td>{new Date(event.end.dateTime).toLocaleString()}</td>
                    <td>{event.description || "No description provided"}</td>
                    <td>{event.location || "No location specified"}</td>
                    <td className="btn-del">
                      <button onClick={() => handleEditEvent(event)}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteEvent(event.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="create-event-section">
            <button
              className="create-event-button"
              onClick={handleSubmitEvent}
            >
              <FaPlus /> Create Event
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
*/