import { DataTable } from "@/components/ui/data-table";
import { Account } from "@/features/accounts/accountApiSlice";
import { FC } from "react";
import { inactiveAccountColumns } from "./components/inactiveaccounts/inactive-account-column";

type InactiveAccountsPresentationProps = {
  accounts: Account[] | undefined;
};

const InactiveAccountsPresentation: FC<InactiveAccountsPresentationProps> = ({
  accounts,
}) => {
  return (
    <div>
      <DataTable
        type="inactive"
        searchKey="clientName"
        clickable={true}
        columns={inactiveAccountColumns}
        data={accounts || []}
        onUrl={false}
      />
    </div>
  );
};

export default InactiveAccountsPresentation;
