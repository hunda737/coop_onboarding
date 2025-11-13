import { DataTable } from "@/components/ui/data-table";
import { Account } from "@/features/accounts/accountApiSlice";
import { FC } from "react";
import { prospectiveColumns } from "./components/prospective/prospective-column";

type ProspectivePresentationProps = {
  accounts: Account[] | undefined;
  isLoading?: boolean;
  isError?: boolean;
};

const ProspectivePresentation: FC<ProspectivePresentationProps> = ({
  accounts,
  isLoading,
  isError,
}) => {
  if (isLoading) return <div>Loading accounts...</div>;
  if (isError) return <div>Error loading accounts.</div>;

  return (
    <div>
      <DataTable
        type="client"
        searchKey="fullName"
        clickable={true}
        columns={prospectiveColumns}
        data={accounts || []}
        onUrl={false}
      />
    </div>
  );
};

export default ProspectivePresentation;
