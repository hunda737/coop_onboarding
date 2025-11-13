import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useCrmModal } from "@/hooks/use-crm-modal";
import { Plus } from "lucide-react";
import { crmColumns } from "./components/crm/crm-column";
import { FC } from "react";
import { CRMUser } from "@/features/crm/crmApiSlice";
import { CRMModal } from "@/components/ui/modals/crm-modal";

type CRMPresentationProps = {
  crmData: CRMUser[] | undefined;
};

const CRMPresentation: FC<CRMPresentationProps> = ({ crmData }) => {
  const crmModal = useCrmModal();
  return (
    <div>
      <CRMModal />
      <div className="flex -mb-6 pb-2 items-center justify-between">
        <div></div>
        <div>
          <Button
            size="sm"
            className="bg-primary relative"
            onClick={() => crmModal.onOpen()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add CRM
          </Button>
        </div>
      </div>
      <DataTable
        clickable={false}
        searchKey="fullName"
        columns={crmColumns}
        data={crmData || []}
        type="crm"
        onUrl={false}
      />
    </div>
  );
};

export default CRMPresentation;
