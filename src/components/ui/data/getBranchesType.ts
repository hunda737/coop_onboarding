import { Branch } from "@/features/branches/branchApiSlice"; // Adjust import as needed

export function getBranchesType(branches: Branch[] | undefined) {
  return (
    branches?.map((branch) => ({
      value: branch.companyName,
      label: branch.companyName,
      color: "#5A5A5A",
    })) || []
  );
}
