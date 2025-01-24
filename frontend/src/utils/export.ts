import jsPDF from "jspdf";
import "jspdf-autotable";
import { EventType } from "@/types/events";

export const exportUtils = {
  toPDF: (events: EventType[]) => {
    const doc = new jsPDF();

    doc.text("Event List", 14, 20);
    const startY = 30;

    if (events.length === 0) {
      doc.text("No events available.", 14, startY);
    } else {
      const formatDateTime = (dateTime: string | undefined) => {
        if (!dateTime) return "N/A";
        const date = new Date(dateTime);
        return date.toLocaleString();
      };

      const truncateText = (text: string | undefined, maxLength: number) => {
        if (!text) return "N/A";
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
      };

    
      doc.autoTable({
        startY,
        head: [["Title", "Start Date", "End Date", "Location"]],
        body: events.map((event) => [
          truncateText(event.summary, 30), 
          formatDateTime(event.start.dateTime),
          formatDateTime(event.end.dateTime),
          truncateText(event.location, 30), 
        ]),
        styles: { fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 40 }, 
          1: { cellWidth: 30 }, 
          2: { cellWidth: 30 },
          4: { cellWidth: 40 }, 
        },
        pageBreak: "auto", 
      });
    }

    doc.save("events.pdf");
  },

  toCSV: (events: EventType[]) => {
    // Utility for formatting date and time
    const formatDateTime = (dateTime: string | undefined) => {
      if (!dateTime) return "N/A";
      const date = new Date(dateTime);
      return date.toLocaleString(); // Converts to local date and time
    };

    // CSV content
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Title,Start Date,End Date,Description,Location\n" +
      events
        .map((event) =>
          `"${event.summary || "N/A"}","${formatDateTime(event.start.dateTime)}","${formatDateTime(
            event.end.dateTime
          )}","${event.description || "N/A"}","${event.location || "N/A"}"`
        )
        .join("\n");

    // Trigger file download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "events.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
