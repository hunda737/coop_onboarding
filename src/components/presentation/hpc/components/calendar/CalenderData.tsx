export type CalendarEvent = {
  id: string;
  title: string;
  start: string | Date | undefined | null;
  status?: string;
  highProfileCustomerName?: string;
  address?: string;
  category?: string;
  feeling?: string;
  notes?: string;
  extendedProps?: {
    category?: string;
    feeling?: string;
    status?: string;
    notes?: string;
    address?: string;
    highProfileCustomerName?: string;
  };
};

export type CalendarEventInfo = {
  event: CalendarEvent;
};

export type DraggableEvent = {
  id: string | null;
  title: string;
  category?: string;
};

type CalendarState = {
  events: DraggableEvent[];
};

export const calendarInitialState: CalendarState = {
  events: [
    {
      title: "Meeting",
      id: null,
      category: "primary",
    },
    { title: "Long Event", id: "3", category: "warning" },
    {
      title: "Lunch",
      id: null,
      category: "info",
    },
    {
      title: "Happy Hour",
      id: null,
      category: "success",
    },
  ],
};
