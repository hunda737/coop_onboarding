import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { User } from "@/features/user/userApiSlice";
import { FC } from "react";
import { useUserModal } from "@/hooks/use-user-modal";
import { Client } from "@/features/client/clientApiSlice";
import { kycColumns } from "./components/kyc/client-column";
import { KycModal } from "@/components/ui/modals/kyc-modal";


type UserPresentationProps = {
  users: User[] | undefined;
  clientId: number;
  client: Client | undefined;
};
const KycPresentation: FC<UserPresentationProps> = ({
  users,
  clientId,
  client,
}) => {
  const userModal = useUserModal();

  // console.log(userModal);
  // console.log(clientId);
  // console.log(client);

  return (
    <div>
      {<KycModal clientId={clientId} client={client} />}
      <div className="flex -mb-12 pb-2 items-center justify-between">
        <div></div>
        <div>
          <Button
            size="sm"
            className="bg-primary relative"
            onClick={() => userModal.onOpen()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add KYC
          </Button>
        </div>
      </div>
      <DataTable
        type="client"
        searchKey="fullName"
        clickable={true}
        columns={kycColumns}
        data={users || []}
        onUrl={false}
      />
    </div>
  );
};

export default KycPresentation;
