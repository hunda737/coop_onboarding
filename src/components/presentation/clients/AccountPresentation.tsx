import { DataTable } from "@/components/ui/data-table";
import { Account } from "@/features/accounts/accountApiSlice";
import { FC } from "react";

import { accountColumns } from "./components/accounts/account-column";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs, TabsContent,

} from "@/components/ui/tabs";

type AccountPresentationProps = {
  accounts: Account[];
  isLoading: boolean;
  isError: boolean;
};

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-[500px] w-full" />
  </div>
);

const ErrorDisplay = () => (
  <div className="p-4 text-red-600 bg-red-100 rounded-md">
    Failed to load accounts. Please try again later.
  </div>
);

const AccountPresentation: FC<AccountPresentationProps> = ({
  accounts,
  isLoading,
  isError
}) => {
  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorDisplay />;

  const individualAccounts = accounts.filter(a =>
    a.customerType === "INDIVIDUAL"
  );

  const jointAccounts = accounts.filter(a =>
    a.customerType === "JOINT"
  );

  const organizationalAccounts = accounts.filter(a =>
    a.customerType === "ORGANIZATION"
  );

  return (
    <Tabs defaultValue="all">


      {/* All accounts tab */}
      <TabsContent value="all">
        <DataTable
          columns={accountColumns}
          data={accounts}
          type="account"
          searchKey="name"
          clickable={true}
          onUrl={false}
        />
      </TabsContent>

      {/* Individual accounts tab */}
      <TabsContent value="individual">
        <DataTable
          columns={accountColumns}
          data={individualAccounts}
          type="account"
          searchKey="name"
          clickable={true}
          onUrl={false}
        />
      </TabsContent>

      {/* Joint accounts tab */}
      <TabsContent value="joint">
        <DataTable
          columns={accountColumns}
          data={jointAccounts}
          type="account"
          searchKey="name"
          clickable={true}
          onUrl={false}
        />
      </TabsContent>

      {/* Organizational accounts tab */}
      <TabsContent value="organizational">
        {organizationalAccounts.length > 0 ? (
          <DataTable
            columns={accountColumns}
            data={organizationalAccounts}
            type="account"
            searchKey="name"
            clickable={true}
            onUrl={false}
          />
        ) : (
          <div className="p-4 text-yellow-600 bg-yellow-50 rounded-md">
            No organizational accounts found
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default AccountPresentation;