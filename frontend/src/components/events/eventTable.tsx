import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { EventType, GoogleDateTime } from "@/types/events";

interface EventTableProps {
  events: EventType[];
  onEdit: (event: EventType) => void;
  onDelete: (event: EventType) => void;
}

export const EventTable: React.FC<EventTableProps> = ({ events, onEdit, onDelete }) => {
  const formatDate = (dateInfo: GoogleDateTime) => {
    if (!dateInfo) return "No date";

    if (dateInfo.date) {
      const date = new Date(dateInfo.date);
      return date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    if (dateInfo.dateTime) {
      const date = new Date(dateInfo.dateTime);
      return date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    return "No date";
  };

  const formatTime = (dateInfo: GoogleDateTime) => {
    if (!dateInfo) return "All day";

    if (dateInfo.date) return "All day";

    if (dateInfo.dateTime) {
      const date = new Date(dateInfo.dateTime);
      return date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "numeric",
        hour12: false, 
      });
    }

    return "All day";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-indigo-200 dark:divide-indigo-700">
        <thead className="bg-indigo-50 dark:bg-indigo-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">
              Event
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-indigo-200 dark:divide-indigo-700">
          {events.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                No events found.
              </td>
            </tr>
          ) : (
            events.map((event, index) => (
              <motion.tr
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="hover:bg-indigo-50 dark:hover:bg-indigo-900/50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                    {event.summary}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(event.start)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {formatTime(event.start)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mr-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                    onClick={() => onEdit(event)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900"
                    onClick={() => onDelete(event)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
