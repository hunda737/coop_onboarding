import { Col } from "reactstrap";
import { CalendarEvent, calendarInitialState } from "./CalenderData";
import { useEventModal } from "@/hooks/use-event-modal";
import { FC, SetStateAction } from "react";
import { Meeting } from "@/features/meeting/meetingApiSlice";
import { Plus } from "lucide-react";
import { parseISO, isToday, compareAsc, format } from "date-fns";

type CalenderEventsProps = {
  setInfo: React.Dispatch<React.SetStateAction<CalendarEvent | null>>;
  setDataToCreate: React.Dispatch<SetStateAction<Partial<Meeting> | null>>;
  meetings: Meeting[] | undefined;
};

const categoryColors: Record<string, string> = {
  primary: "bg-cyan-200 text-cyan-700", // Softer cyan
  danger: "bg-red-200 text-red-700", // Softer red
  info: "bg-teal-200 text-teal-700", // Softer teal
  warning: "bg-yellow-200 text-yellow-700", // Softer yellow
  success: "bg-green-200 text-green-700", // Softer green
};

const CalendarEvents: FC<CalenderEventsProps> = ({
  setInfo,
  setDataToCreate,
  meetings,
}) => {
  const filterAndSortTodaysMeetings = () => {
    return (
      meetings
        ?.filter((meeting) => {
          const meetingDate = parseISO(meeting.meetingDate);
          return isToday(meetingDate);
        })
        .sort((a, b) => {
          const timeA = parseISO(`${a.meetingDate}T${a.meetingTime}`);
          const timeB = parseISO(`${b.meetingDate}T${b.meetingTime}`);
          return compareAsc(timeA, timeB);
        }) || []
    );
  };

  const todaysMeetings = filterAndSortTodaysMeetings();

  const eventModal = useEventModal();
  return (
    <Col
      xxl={3}
      xl={4}
      className="box-col-30 space-y-0 flex space-x-2 lg:space-y-2 lg:flex-col lg:space-x-0"
    >
      <div
        id="external-events"
        className="calendar-default p-5 shadow-sm bg-white rounded-lg"
      >
        <button
          onClick={() => {
            setInfo(null);
            setDataToCreate(null);
            eventModal.onOpen();
          }}
          className="mb-2 w-full py-1 text-white bg-primary rounded-md flex items-center justify-center"
        >
          <Plus size={16} className="-ml-2 mr-2" />
          Create New Event
        </button>

        <h3 className="text-gray-600 font-medium text-base mb-2">
          Draggable Events
        </h3>
        <p className="text-xs text-gray-500 mb-2">
          Drag and drop your event or click in the calendar
        </p>

        <div className="external-events">
          <div className="external-events-list">
            {calendarInitialState.events.map((event, index) => {
              const colorClass = categoryColors[event.category || "primary"];

              return (
                <div
                  className={`fc-event fc-h-event cursor-move fc-daygrid-event fc-daygrid-block-event p-md-3 p-2 text-sm mb-1 border-0 rounded-md ${colorClass}`}
                  title={event.title}
                  data-id={event.id}
                  data-category={event.category}
                  key={index}
                >
                  <div className="">{event.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="calendar-default p-5 w-72 h-80 overflow-hidden overflow-y-scroll shadow-sm bg-white rounded-lg">
        <div>
          <h3 className="text-gray-600 font-medium text-base mb-2">
            Upcoming Events
          </h3>
          <p className="text-xs text-gray-500 mb-2">
            These are your upcoming events
          </p>
        </div>
        <div>
          {todaysMeetings.length > 0 ? (
            <ul className="space-y-2">
              {todaysMeetings.map((meeting) => {
                const colorClass =
                  categoryColors[meeting.category || "primary"];
                return (
                  <li
                    key={meeting.meetingId}
                    className={`flex items-center justify-between p-2 ${colorClass} rounded-md`}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {meeting.highProfileCustomerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(
                          parseISO(
                            `${meeting.meetingDate}T${meeting.meetingTime}`
                          ),
                          "hh:mm a"
                        )}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {meeting.reason}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-base text-cyan-500">No meetings for today.</p>
          )}
        </div>
      </div>
    </Col>
  );
};

export default CalendarEvents;
