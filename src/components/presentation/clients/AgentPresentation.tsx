import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { AgentModal } from "@/components/ui/modals/agent-modal";
import { Agent } from "@/features/agents/agentApiSlice";
import { Client } from "@/features/client/clientApiSlice";
import { useAgentModal } from "@/hooks/use-user-modal";
import { Plus } from "lucide-react";
import { FC } from "react";
import { agentColumns } from "./components/agents/agent-column";
import { User } from "@/features/user/userApiSlice";

type AgentPresentationProps = {
  agents: Agent[] | undefined;
  client: Client | undefined;
  currentUser: User | undefined;
};

const AgentPresentation: FC<AgentPresentationProps> = ({
  agents,
  client,
  currentUser,
}) => {
  const agentModal = useAgentModal();
  return (
    <div>
      <AgentModal
        client={client}
        isEdit={agentModal?.isEdit}
        existingData={agentModal?.editData}
      />
      <div
        className={`flex ${
          currentUser?.role !== "SUPER-ADMIN" && "-mb-12"
        } pb-2 items-center justify-between`}
      >
        <div></div>
        <div>
          {currentUser?.role !== "SUPER-ADMIN" && (
            <Button
              size="sm"
              className="bg-primary relative"
              onClick={() => agentModal.onOpen()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Agent
            </Button>
          )}
        </div>
      </div>
      <DataTable
        type="target"
        searchKey="fullName"
        clickable={true}
        columns={agentColumns}
        data={agents || []}
        onUrl={false}
      />
    </div>
  );
};

export default AgentPresentation;
