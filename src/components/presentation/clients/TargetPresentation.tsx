import { DataTable } from "@/components/ui/data-table";
import { BranchTarget } from "@/features/target/targetApiSlice";
import { targetColumns } from "./components/target/target-column";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTargetModal } from "@/hooks/use-target-modal";
import { TargetModal } from "@/components/ui/modals/target-modal";
import { Branch } from "@/features/branches/branchApiSlice";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { User } from "@/features/user/userApiSlice";

type TargetPresentationProps = {
  targets: BranchTarget[] | undefined;
  branches: Branch[] | undefined;
  districtId: number | undefined;
  currentUser: User | undefined;
};

const TargetPresentation: React.FC<TargetPresentationProps> = ({
  targets,
  branches,
  districtId,
  currentUser,
}) => {
  const targetModal = useTargetModal();
  const [type, setType] = useState("branch");

  const branchesType =
    branches?.map((branch) => ({
      value: branch.companyName,
      label: branch.companyName,
      color: "#5A5A5A",
    })) || [];

  const filteredTargets = targets?.filter((target) => {
    if (type === "district") {
      return target.district;
    } else if (type === "branch") {
      return !target.district;
    }
  });

  // Set hasDistrict based on selected type
  const hasDistrict = type === "district";

  return (
    <div>
      <TargetModal branches={branches} districtId={districtId} />
      <div className="flex -mb-4 pb-2 items-center justify-between">
        <div></div>
        <div className="flex items-center space-x-2">
          <Select
            defaultValue="branch"
            onValueChange={(value) => setType(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {(currentUser?.role === "SUPER-ADMIN" ||
                  currentUser?.role === "CLIENT-ADMIN") && (
                  <SelectItem value="district">District</SelectItem>
                )}
                <SelectItem value="branch">Branch</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="bg-primary relative"
            onClick={() => targetModal.onOpen()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Target
          </Button>
        </div>
      </div>
      <DataTable
        type="target"
        searchKey={String(type)}
        clickable={false}
        columns={targetColumns(branchesType, hasDistrict)}
        data={filteredTargets || []}
        onUrl={false}
      />
    </div>
  );
};

export default TargetPresentation;
