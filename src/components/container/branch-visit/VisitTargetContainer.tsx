import { VisitTargetPresentation } from "@/components/presentation/branch-visit";
import { useGetAllBranchesQuery } from "@/features/branches/branchApiSlice";
import { useAppSelector } from "@/hooks";

const VisitTargetContainer = () => {
  const { data: branches } = useGetAllBranchesQuery();
  const { targets } = useAppSelector((state) => state.visitTargets);

  // console.log(targets);

  return (
    <div>
      <VisitTargetPresentation visitTargets={targets} branches={branches} />
    </div>
  );
};

export default VisitTargetContainer;
