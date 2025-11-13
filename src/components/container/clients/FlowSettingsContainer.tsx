import FlowSettingsPresentation from "@/components/presentation/clients/FlowSettingsPresentation";
import { useGetAllFlowSettingsQuery } from "@/features/account-flow-settings/accountFlowSettingsApiSlice";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";

const FlowSettingsContainer = () => {
  const { data: flowSettings, isLoading } = useGetAllFlowSettingsQuery();
  const { data: currentUser } = useGetCurrentUserQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <FlowSettingsPresentation
      flowSettings={flowSettings}
      currentUser={currentUser}
    />
  );
};

export default FlowSettingsContainer;

