import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EngagementTimeline } from "./EngagementTimeline";
import { CallLog } from "./CallLog";

export const EngagementTabs = () => {
  return (
    <Tabs defaultValue="engagement" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="engagement" className="w-full">
          Customer Engagement
        </TabsTrigger>
        <TabsTrigger value="call-log" className="w-full">
          Call Log
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="engagement"
        className="h-[27rem] custom-scrollbar overflow-y-scroll"
      >
        <EngagementTimeline />
      </TabsContent>
      <TabsContent
        value="call-log"
        className="h-[27rem] custom-scrollbar overflow-y-scroll"
      >
        <CallLog />
      </TabsContent>
    </Tabs>
  );
};
