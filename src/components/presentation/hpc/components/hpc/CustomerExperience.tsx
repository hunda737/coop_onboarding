import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ServiceRequestsTable } from "./ServiceRequestsTable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import RelationGraph from "./RelationGraph";
import Cases from "./Cases";
import Leads from "./Leads";
import Opportunity from "./Opportunity";
import Notes from "./Notes";

export const CustomerExperience = () => {
  return (
    <div>
      <Accordion
        type="single"
        collapsible
        defaultValue="item-1"
        className="w-full"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Customer Experience</AccordionTrigger>
          <AccordionContent className="h-[20rem]">
            <Tabs defaultValue="networks" className="w-full">
              <TabsList>
                <TabsTrigger value="networks">Networks</TabsTrigger>
                <TabsTrigger value="service-requests">
                  Service Requests
                </TabsTrigger>
                <TabsTrigger value="cases">Cases</TabsTrigger>
                <TabsTrigger value="leads">Leads</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              </TabsList>
              <TabsContent value="networks">
                <RelationGraph />
              </TabsContent>
              <TabsContent value="service-requests">
                <ServiceRequestsTable />
              </TabsContent>
              <TabsContent value="cases">
                <Cases />
              </TabsContent>
              <TabsContent value="leads">
                <Leads />
              </TabsContent>
              <TabsContent value="opportunities">
                <Opportunity />
              </TabsContent>
            </Tabs>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Notes</AccordionTrigger>
          <AccordionContent className="h-[21rem]">
            <Notes />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
