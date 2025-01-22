import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventType, NewEventType } from "@/types/events";

interface EventDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedEvent: EventType | null;
    onSubmit: (event: NewEventType) => Promise<void>;
}

export const EventDialog: React.FC<EventDialogProps> = ({ 
    open, 
    onOpenChange, 
    selectedEvent, 
    onSubmit 
}) => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newEvent: NewEventType = {
            summary: formData.get("title") as string,
            startDate: formData.get("date") as string,
            startTime: formData.get("time") as string,
            endDate: formData.get("date") as string,
            endTime: formData.get("time") as string,
            description: formData.get("description") as string,
            location: "",
        };

        await onSubmit(newEvent);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>{selectedEvent ? "Edit Event" : "Create Event"}</DialogTitle>
                    <DialogDescription>
                        {selectedEvent ? "Edit the details of your event." : "Add a new event to your calendar."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Event Title"
                        name="title"
                        defaultValue={selectedEvent?.summary || ""}
                        className="border-indigo-600 dark:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        required
                    />
                    <Input
                        type="date"
                        name="date"
                        defaultValue={
                            selectedEvent?.start?.dateTime
                                ? selectedEvent.start.dateTime.split('T')[0]
                                : ""
                        }
                        className="border-indigo-600 dark:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        required
                    />
                    <Input
                        type="time"
                        name="time"
                        defaultValue={
                            selectedEvent?.start?.dateTime
                                ? selectedEvent.start.dateTime.split('T')[1]?.split('.')[0] || ""
                                : ""
                        }
                        className="border-indigo-600 dark:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        required
                    />
                    <Select name="type" defaultValue="work">
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
    );
};