import { DataTable } from "@/components/ui/data-table";
import { RTGSRequest } from "../../../features/rtgs/rtgsApiSlice";
import { Client } from "@/features/client/clientApiSlice";
import { Plus } from "lucide-react";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { rtgColumns } from "./components/rtgs/column";
import { useRtgsModal } from "@/hooks/use-rtgs-modal";
import { RTGSModal } from "@/components/ui/modals/rtgs-modal";

type RTGSPresentationProps = {
  rtgs: RTGSRequest[] | undefined;
  clientId: number;
  client: Client | undefined;
};

const RtgsPresentation: FC<RTGSPresentationProps> = ({
  rtgs,
  clientId,
  client,
}) => {
  // console.log(rtgs);
  // console.log(clientId);
  // console.log(client);
  const rtgsModal = useRtgsModal();

  return (
    <div>
      {clientId && client && <RTGSModal />}
      <div className="flex -mb-12 pb-2 items-center justify-between">
        <div></div>
        <div>
          <Button
            size="sm"
            className="bg-primary relative"
            onClick={() => rtgsModal.onOpen()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add RTGS
          </Button>
        </div>
      </div>
      <DataTable
        type="client"
        searchKey="fullName"
        clickable={true}
        columns={rtgColumns}
        data={rtgs || []}
        onUrl={false}
      />
    </div>
  );
};

export default RtgsPresentation;
