import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { User } from "@/features/user/userApiSlice";
import { FC } from "react";
import { Client } from "@/features/client/clientApiSlice";
import { userColumns } from "./users/user-column";
import { useVisitUserModal } from "@/hooks/use-visit-user-modal";
import { UserVisitModal } from "@/components/ui/modals/visit-user-modal";

type VisitUserPresentationProps = {
  users: User[] | undefined;
  clientId: number;
  client: Client | undefined;
};
const VisitUserPresentation: FC<VisitUserPresentationProps> = ({
  users,
  clientId,
  client,
}) => {
  const userModal = useVisitUserModal();

  return (
    <div>
      {clientId && client && (
        <UserVisitModal clientId={clientId} client={client} />
      )}
      <div className="flex -mb-12 pb-2 items-center justify-between">
        <div></div>
        <div>
          <Button
            size="sm"
            className="bg-primary relative"
            onClick={() => userModal.onOpen()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>
      <DataTable
        type="client"
        searchKey="fullName"
        clickable={true}
        columns={userColumns}
        data={users || []}
        onUrl={false}
      />
    </div>
  );
};

export default VisitUserPresentation;
