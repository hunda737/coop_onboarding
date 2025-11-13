import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { userColumns } from "./components/users/user-column";
import { User } from "@/features/user/userApiSlice";
import { FC } from "react";
import { UserModal } from "@/components/ui/modals/user-modal";
import { useUserModal } from "@/hooks/use-user-modal";
import { Client } from "@/features/client/clientApiSlice";

type UserPresentationProps = {
  users: User[] | undefined;
  clientId: number;
  client: Client | undefined;
};
const UserPresentation: FC<UserPresentationProps> = ({
  users,
  clientId,
  client,
}) => {
  const userModal = useUserModal();

  return (
    <div>
      {clientId && client && <UserModal clientId={clientId} client={client} />}
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

export default UserPresentation;
