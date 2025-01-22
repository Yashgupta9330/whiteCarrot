import React from "react";
import { EventType } from "@/types/events";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

interface InsightsBarProps {
  events: EventType[];
}

export const Insights: React.FC<InsightsBarProps> = ({ events }) => {

  const dayCount: Record<string, number> = {};
  events.forEach((event) => {
    if (event.start?.dateTime) { 
      const day = new Date(event.start.dateTime).toLocaleString("en-US", { weekday: "long" });
      dayCount[day] = (dayCount[day] || 0) + 1;
    }
  });
  const busiestDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const totalHours = events.reduce((sum, event) => {
    if (!event.start?.dateTime || !event.end?.dateTime) return sum;
    const start = new Date(event.start.dateTime).getTime();
    const end = new Date(event.end.dateTime).getTime();
    return sum + (end - start) / (1000 * 60 * 60); 
  }, 0);
  const avgWorkingHours = events.length > 0 ? (totalHours / events.length).toFixed(1) + " hours" : "0 hours";


  const eventTypeCount: Record<string, number> = {};
  events.forEach((event) => {
    if (event.summary) { 
      eventTypeCount[event.summary] = (eventTypeCount[event.summary] || 0) + 1;
    }
  });
  const mostCommonEvent = Object.entries(eventTypeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const eventTypeData = [
    { name: "Work", value: events.filter((e) => e.eventType === "work").length, color: "#6366f1" },
    { name: "Personal", value: events.filter((e) => e.eventType === "personal").length, color: "#f59e0b" },
    { name: "Other", value: events.filter((e) => e.eventType !== "work" && e.eventType !== "personal").length, color: "#10b981" },
  ];

  const analytics = [
    { title: "Busiest Day", value: busiestDay, color: "#6366f1" },
    { title: "Average Working Hours", value: avgWorkingHours, color: "#10b981" },
    { title: "Most Common Event", value: mostCommonEvent, color: "#f59e0b" },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {analytics.map((item, index) => (
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
        <CardContent className="h-[200px] p-2">
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
  );
};
