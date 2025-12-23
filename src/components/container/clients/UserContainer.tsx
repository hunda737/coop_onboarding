import { UserPresentation } from "@/components/presentation/clients";
import { useGetClientByIdQuery } from "@/features/client/clientApiSlice";
import {
  useGetCurrentUserQuery,
  useGetUsersByClientIdQuery,
} from "@/features/user/userApiSlice";
import { useParams } from "react-router-dom";

const UserContainer = () => {
  const params = useParams();
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: users, isLoading: isLoadingUsers } = useGetUsersByClientIdQuery(
    params.clientId ? params.clientId : String(currentUser?.client.id)
  );
  const { data: client } = useGetClientByIdQuery(
    params.clientId ? params.clientId : String(currentUser?.client.id)
  );

  return (
    <UserPresentation
      users={users}
      clientId={Number(params.clientId || currentUser?.client.id)}
      client={client}
      isLoading={isLoadingUsers}
    />
  );
};

export default UserContainer;
