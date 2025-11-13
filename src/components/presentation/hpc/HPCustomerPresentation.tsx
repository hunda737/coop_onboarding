import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { hpcColumns } from "./components/hpc/hpc-column";
import { HighProfileCustomerResponse } from "@/features/hpc/hpcApiSlice";
import { FC } from "react";

interface HPCustomerPresentationProps {
  hpcData: HighProfileCustomerResponse[] | undefined;
}
const HPCustomerPresentation: FC<HPCustomerPresentationProps> = ({
  hpcData,
}) => {
  return (
    <div className="">
      <div className="flex -mb-6 pb-2 items-center justify-between">
        <div></div>
        <div>
          <Button
            size="sm"
            className="bg-primary relative"
            // onClick={() => crmModal.onOpen()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add HPC
          </Button>
        </div>
      </div>
      <DataTable
        clickable={true}
        searchKey="accHolderName"
        columns={hpcColumns}
        data={hpcData || []}
        type="hpc"
        onUrl={true}
      />
    </div>
  );
};

export default HPCustomerPresentation;
