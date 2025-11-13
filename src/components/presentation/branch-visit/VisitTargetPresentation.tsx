import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { VisitTarget } from "@/features/visit-target/visitTargetApiSlice";
import { FC } from "react";
import { visitTargetColumns } from "./target/target-column";
import { Branch } from "@/features/branches/branchApiSlice";
import { useVisitTargetModal } from "@/hooks/use-visit-target-modal";
import { VisitTargetModal } from "@/components/ui/modals/visit-target-modal";

type VisitTargetPresentationProps = {
  visitTargets: VisitTarget[] | undefined;
  branches: Branch[] | undefined;
};
const VisitTargetPresentation: FC<VisitTargetPresentationProps> = ({
  visitTargets,
  branches,
}) => {
  const visitTargetModal = useVisitTargetModal();

  // console.log(visitTargets);

  return (
    <div>
      <VisitTargetModal branches={branches} />
      <div className="flex -mb-6 pb-2 items-center justify-between">
        <div></div>
        <div>
          <Button
            size="sm"
            className="bg-primary relative"
            onClick={() => visitTargetModal.onOpen()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Target
          </Button>
        </div>
      </div>
      <DataTable
        type="visit-target"
        searchKey="fullName"
        clickable={true}
        columns={visitTargetColumns}
        data={visitTargets || []}
        onUrl={false}
      />
    </div>
  );
};

export default VisitTargetPresentation;
