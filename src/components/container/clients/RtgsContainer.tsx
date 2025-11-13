import { RtgsPresentation } from "@/components/presentation/clients";
import { useGetClientByIdQuery } from "@/features/client/clientApiSlice";
import { useGetRTGSRequestsQuery } from "@/features/rtgs/rtgsApiSlice";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import { useParams } from "react-router-dom";

const RtgsContainer = () => {
  const params = useParams();
  const { data: currentUser } = useGetCurrentUserQuery();
  // const { data: users } = useGetRTGSRequestsQuery(
  //   params.clientId ? params.clientId : String(currentUser?.client.id)
  // );
  const { data: rtgsRequests } = useGetRTGSRequestsQuery();

  const { data: client } = useGetClientByIdQuery(
    params.clientId ? params.clientId : String(currentUser?.client.id)
  );

  return (
    <div>
      <RtgsPresentation
        rtgs={rtgsRequests}
        clientId={Number(params.clientId || currentUser?.client.id)}
        client={client}
      />
    </div>
  );
};

export default RtgsContainer;
