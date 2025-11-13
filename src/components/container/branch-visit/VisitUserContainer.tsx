import { VisitUserPresentation } from "@/components/presentation/branch-visit";
import { useGetClientByIdQuery } from "@/features/client/clientApiSlice";
import {
  useGetCurrentUserQuery,
  useGetUsersByClientIdQuery,
} from "@/features/user/userApiSlice";
import { useParams } from "react-router-dom";

const VisitUserContainer = () => {
  const params = useParams();
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: users } = useGetUsersByClientIdQuery(
    params.clientId ? params.clientId : String(currentUser?.client.id)
  );
  const { data: client } = useGetClientByIdQuery(
    params.clientId ? params.clientId : String(currentUser?.client.id)
  );

  return (
    <VisitUserPresentation
      users={users?.filter((u) => u.role.includes("VISIT"))}
      clientId={Number(params.clientId || currentUser?.client.id)}
      client={client}
    />
  );
};

export default VisitUserContainer;
