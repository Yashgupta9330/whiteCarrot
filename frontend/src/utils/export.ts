import jsPDF from "jspdf";
import "jspdf-autotable";
import { EventType } from '@/types/events';
import { formatDateTime } from './Date';

export const exportUtils = {
  toPDF: (events: EventType[]) => {
    const doc = new jsPDF();
    doc.text("Event List", 14, 15);
    doc.autoTable({
      head: [["Title", "Start Date", "End Date", "Description", "Location"]],
      body: events.map((event) => [
        event.summary,
        formatDateTime.toLocalDate(event.start.dateTime),
        formatDateTime.toLocalDate(event.end.dateTime),
        event.description || "",
        event.location || "",
      ]),
    });
    doc.save("events.pdf");
  },

  toCSV: (events: EventType[]) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Title,Start Date,End Date,Description,Location\n" +
      events
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
  },
};
