interface CallLogEntry {
  id: number;
  callerName: string;
  callType: "incoming" | "outgoing" | "missed";
  date: string;
  time: string;
}

const callLogData: CallLogEntry[] = [
  {
    id: 1,
    callerName: "John Doe",
    callType: "incoming",
    date: "10-Aug-2022",
    time: "17:13:55",
  },
  {
    id: 2,
    callerName: "Jane Smith",
    callType: "outgoing",
    date: "10-Aug-2022",
    time: "16:42:30",
  },
  {
    id: 3,
    callerName: "Michael Johnson",
    callType: "missed",
    date: "10-Aug-2022",
    time: "15:10:15",
  },
  {
    id: 4,
    callerName: "Sarah Connor",
    callType: "incoming",
    date: "09-Aug-2022",
    time: "14:20:10",
  },
];

const getCallTypeIcon = (callType: string) => {
  switch (callType) {
    case "incoming":
      return "📥"; // Incoming call icon
    case "outgoing":
      return "📤"; // Outgoing call icon
    case "missed":
      return "❌"; // Missed call icon
    default:
      return "📞"; // Default call icon
  }
};

export const CallLog = () => {
  return (
    <div className="bg-white w-full max-w-3xl mx-auto">
      <ul className="space-y-2">
        {callLogData.map((log) => (
          <li
            key={log.id}
            className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-all rounded-lg p-2 shadow-sm"
          >
            <div className="w-1/4 flex items-center space-x-2">
              <span className="text-xs whitespace-nowrap">
                {getCallTypeIcon(log.callType)}
              </span>
              <span className="text-gray-800 text-sm font-medium whitespace-nowrap">
                {log.callerName}
              </span>
            </div>

            <div className="text-gray-600 text-xs whitespace-nowrap">
              {log.date}
            </div>
            <div className="text-gray-600 text-xs">{log.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
