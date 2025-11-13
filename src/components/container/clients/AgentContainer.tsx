import { AgentPresentation } from "@/components/presentation/clients";
import { useGetAgentsQuery } from "@/features/agents/agentApiSlice";
import { useGetClientByIdQuery } from "@/features/client/clientApiSlice";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import { useParams } from "react-router-dom";

const AgentContainer = () => {
  const params = useParams();
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: client } = useGetClientByIdQuery(
    params.clientId ? params.clientId : String(currentUser?.client.id)
  );

  const { data: agents } = useGetAgentsQuery({
    clientId: params.clientId
      ? params.clientId
      : String(currentUser?.client.id),
  });

  return (
    <AgentPresentation
      currentUser={currentUser}
      agents={agents}
      client={client}
    />
  );
};

export default AgentContainer;
