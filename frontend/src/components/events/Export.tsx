import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { exportUtils } from "@/utils/export";
import { EventType } from "@/types/events";

interface ExportBarProps {
  events: EventType[];
}

const Export: React.FC<ExportBarProps> = ({ events }) => {
  return (
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
        <DropdownMenuItem onClick={() => exportUtils.toPDF(events)}>Export to PDF</DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportUtils.toCSV(events)}>Export to CSV</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Export;
