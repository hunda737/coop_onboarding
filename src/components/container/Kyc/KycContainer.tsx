import { useGetClientByIdQuery } from "@/features/client/clientApiSlice";
import {
  useGetCurrentUserQuery,
  useGetKycUsersQuery,
} from "@/features/user/userApiSlice";
import { useParams } from "react-router-dom";
import KycPresentation from "@/components/presentation/clients/KycPresentation";


const KycContainer = () => {
  const params = useParams();
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: users, isLoading: isLoadingUsers, isError: isErrorUsers } = useGetKycUsersQuery();
  const { data: client } = useGetClientByIdQuery(
    params?.clientId ? params?.clientId : String(currentUser?.client?.id)
  );

  if (isLoadingUsers) return <div>Loading...</div>;
  if (isErrorUsers) return <div>Error loading users</div>;

  return (
    <KycPresentation
      users={users}
      clientId={Number(params?.clientId || currentUser?.client?.id)}
      client={client}
    />
  );
};

export default KycContainer;
