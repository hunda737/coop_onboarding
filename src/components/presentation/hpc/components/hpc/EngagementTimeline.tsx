import { useState } from "react";
import { useGetMyMeetingsQuery } from "@/features/meeting/meetingApiSlice";
import { ChevronRight, ChevronDown, Notebook } from "lucide-react";
import { useParams } from "react-router-dom";

export const EngagementTimeline = () => {
  const params = useParams();
  const { data: meetings } = useGetMyMeetingsQuery({
    hpc: Number(params.customerId),
  });
  const [expandedMeetingId, setExpandedMeetingId] = useState<number | null>(
    null
  );

  const toggleExpand = (meetingId: number) => {
    setExpandedMeetingId((prev) => (prev === meetingId ? null : meetingId));
  };

  return (
    <div className="p-1">
      <div className="flex flex-col space-y-4">
        {meetings?.map((item) => (
          <div
            key={item.meetingId}
            className="flex flex-col space-y-2 border-b pb-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 w-full">
                <div
                  className="cursor-pointer"
                  onClick={() => toggleExpand(item.meetingId)}
                >
                  {expandedMeetingId === item.meetingId ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
                <div className="flex items-center justify-center p-1 bg-green-500/60 rounded-full text-white">
                  <Notebook size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold">{item.reason} </h4>
                  <p className="text-xs text-gray-500">
                    Meeting initiated by {item.crmName}
                  </p>
                </div>
              </div>
              <div className="flex flex-col text-xs whitespace-nowrap self-start text-gray-400">
                <span>{item.meetingDate}</span>
                <span className="text-xs lowercase text-[#00ADEF]">
                  {item.status}
                </span>
              </div>
            </div>
            {expandedMeetingId === item.meetingId && (
              <div className="ml-8 space-y-1 text-xs text-gray-600">
                {item.feeling && (
                  <p>
                    <span className="font-semibold">Feeling:</span>{" "}
                    {item.feeling}
                  </p>
                )}
                {item.emotionalAttachment && (
                  <p>
                    <span className="font-semibold">Emotional Attachment:</span>{" "}
                    {item.emotionalAttachment}
                  </p>
                )}
                {item.notes && (
                  <p>
                    <span className="font-semibold">Notes:</span> {item.notes}
                  </p>
                )}
                {item.category && (
                  <p>
                    <span className="font-semibold">Category:</span>{" "}
                    {item.category}
                  </p>
                )}
                {item.address && (
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {item.address}
                  </p>
                )}
                {item.status && (
                  <p>
                    <span className="font-semibold">Status:</span> {item.status}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
