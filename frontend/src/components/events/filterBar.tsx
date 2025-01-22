import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { handleTodayClick } from "@/utils/Date";
import { EventType } from "@/types/events";
import Export from "./Export";

interface FilterBarProps {
  events: EventType[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterDate: string;
  onFilterDateChange: (value: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  filterDate,
  onFilterDateChange,
  events
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleToday = () => {
    if (!isActive) {
      const todayDate = handleTodayClick();
      onFilterDateChange(todayDate);
      setIsActive(true);
    } else {
      onFilterDateChange("");
      setIsActive(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-6">
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mb-4 sm:mb-0">
        <Input
          type="date"
          className="w-full sm:w-auto border-indigo-600 dark:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:text-gray-300"
          value={filterDate}
          onChange={(e) => {
            onFilterDateChange(e.target.value);
            setIsActive(!!e.target.value);
          }}
        />
        <Button
          variant="outline"
          onClick={handleToday}
          className={`w-full sm:w-auto border-indigo-600 dark:border-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 
            ${isActive 
              ? 'bg-indigo-600 text-white dark:bg-indigo-400' 
              : 'text-indigo-600 dark:text-indigo-400'
            }`}
        >
          Today
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <Input
            placeholder="Search events"
            className="pl-8 w-full border-indigo-600 dark:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:text-gray-300"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Export events={events} />
      </div>
    </div>
  );
};