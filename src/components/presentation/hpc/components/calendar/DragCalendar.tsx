import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { Fragment, SetStateAction, useEffect, useState } from "react";
import { Col } from "reactstrap";
import CalendarEvents from "./CalendarEvents";
import { CalendarEvent, CalendarEventInfo } from "./CalenderData";
import { EventModal } from "@/components/ui/modals/event-modal";
import { useEventModal } from "@/hooks/use-event-modal";
import "./calendar.css";
import {
  Meeting,
  useUpdateMeetingMutation,
} from "@/features/meeting/meetingApiSlice";
import toast from "react-hot-toast";

type CalendarProps = {
  meetings: Meeting[] | undefined;
};

const DragCalendar: React.FC<CalendarProps> = ({ meetings }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [info, setInfo] = useState<CalendarEvent | null>(null);
  const eventModal = useEventModal();
  const [dataToCreate, setDataToCreate] = useState<Partial<Meeting> | null>(
    null
  );
  const [updateMeeting] = useUpdateMeetingMutation();

  const handleDateRecieve = (
    infoReceived: SetStateAction<Partial<Meeting> | null>
  ) => {
    setInfo(null);
    setDataToCreate(infoReceived);
    eventModal.onOpen();
  };

  const handleClickEvent = (returnedInfo: CalendarEventInfo) => {
    setInfo(returnedInfo.event);
    eventModal.onOpen();
  };

  // Transform meetings into calendar events
  useEffect(() => {
    if (meetings) {
      const transformedEvents = meetings.map((meeting) => ({
        id: meeting.meetingId.toString(),
        title: `${meeting.reason}`,
        start: `${meeting.meetingDate}T${meeting.meetingTime}`,
        status: meeting.status,
        highProfileCustomerName: meeting.highProfileCustomerName,
        address: meeting.address,
        feeling: meeting.feeling,
        notes: meeting.notes,
        category: meeting.category,
      }));
      setEvents(transformedEvents);
    }
  }, [meetings]);

  // Draggable initialization
  useEffect(() => {
    const draggableEl = document.getElementById(
      "external-events"
    ) as HTMLElement | null;

    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: (eventEl) => {
          const title = eventEl.getAttribute("title") || "";
          const id = eventEl.getAttribute("data-id") || "";
          const category = eventEl.getAttribute("data-category") || "";
          return { title, id, category };
        },
      });
    }

    const calendarEl = document.getElementById("mycalendartest");
    if (calendarEl) {
      calendarEl.addEventListener("drop", (e) => {
        e.preventDefault();
      });
    }
  }, []);

  // Handle event drop (dragged within calendar)
  const handleEventDrop = async (info: CalendarEventInfo) => {
    const { event } = info;
    await updateMeeting({
      meetingId: Number(event.id),
      meetingDate: event.start
        ? new Date(event.start).toLocaleDateString("en-CA")
        : "",
      meetingTime: event.start
        ? new Date(event.start).toLocaleTimeString("en-GB", {
            hour12: false,
          })
        : "",
    }).unwrap();
    toast.success("Meeting updated successfully!");
  };

  return (
    <Fragment>
      <EventModal event={info} dataToCreate={dataToCreate} />
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="w-96">
          <CalendarEvents
            setInfo={setInfo}
            meetings={meetings}
            setDataToCreate={setDataToCreate}
          />
        </div>
        <div className="w-full border rounded-xl p-5 bg-white">
          <Col xxl={9} xl={8} className="box-col-70">
            <div className="demo-app-calendar" id="mycalendartest">
              <FullCalendar
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                eventColor="#"
                rerenderDelay={10}
                editable
                droppable
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                events={events}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                eventClick={(returnedInfo) => handleClickEvent(returnedInfo)}
                eventDrop={handleEventDrop}
                eventReceive={(info) => {
                  if (!info.event.id) {
                    console.warn(
                      "Event ID is missing; event will not be added."
                    );
                    info.event.remove();
                  }
                  handleDateRecieve({
                    meetingDate: info.event.start
                      ? new Date(info.event.start).toLocaleDateString("en-CA")
                      : "",
                    meetingTime: info.event.start
                      ? new Date(info.event.start).toLocaleTimeString("en-GB", {
                          hour12: false,
                        })
                      : "",
                    reason: info.event.title || "",
                    category: info.event.extendedProps.category || "",
                    address: "",
                  });
                }}
                eventClassNames={(arg) => {
                  const category = arg.event.extendedProps.category;
                  if (category === "danger") return "event-category-danger";
                  if (category === "primary") return "event-category-primary";
                  if (category === "info") return "event-category-info";
                  if (category === "warning") return "event-category-warning";
                  if (category === "success") return "event-category-success";
                  return "";
                }}
              />
            </div>
          </Col>
        </div>
      </div>
    </Fragment>
  );
};

export default DragCalendar;
