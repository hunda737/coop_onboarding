import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Client } from "@/features/client/clientApiSlice";
import { Plus } from "lucide-react";
import { FC } from "react";
import { clientColumns } from "./components/clients/client-column";
import { useClientModal } from "@/hooks/use-client-modal";

interface ClientPresentationProps {
  clients: Client[] | undefined;
}

const ClientPresentation: FC<ClientPresentationProps> = ({ clients }) => {
  const clientModal = useClientModal();
  // console.log(clients);

  return (
    <div>
      <div className="flex -mb-12 pb-2 items-center justify-between">
        <div></div>
        <div>
          <Button
            size="sm"
            className="bg-primary relative"
            onClick={() => {
              clientModal.onOpen();
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      {/* {
        clients != null || clients != undefined || client
      } */}
      <DataTable
        type="client"
        searchKey="clientName"
        clickable={true}
        columns={clientColumns}
        // data={[]}
        data={clients || []}
        onUrl={false}
      />
    </div>
  );
};

export default ClientPresentation;
