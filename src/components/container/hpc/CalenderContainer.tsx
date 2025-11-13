import { CalenderPresentation } from "@/components/presentation/hpc";
import { useGetMyMeetingsQuery } from "@/features/meeting/meetingApiSlice";

const CalenderContainer = () => {
  const { data: meetings } = useGetMyMeetingsQuery({});
  return (
    <div>
      <CalenderPresentation meetings={meetings} />
    </div>
  );
};

export default CalenderContainer;
