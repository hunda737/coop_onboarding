import { DataTable } from "@/components/ui/data-table";
import { AccountFlowSettings } from "@/features/account-flow-settings/accountFlowSettingsApiSlice";
import { flowSettingsColumns } from "./components/flow-settings/flow-settings-columns";
import { Button } from "@/components/ui/button";
import { Plus, Info } from "lucide-react";
import { useFlowSettingsModal } from "@/hooks/use-flow-settings-modal";
import { FlowSettingsModal } from "@/components/ui/modals/flow-settings-modal";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/features/user/userApiSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

type FlowSettingsPresentationProps = {
  flowSettings: AccountFlowSettings[] | undefined;
  currentUser: User | undefined;
};

const FlowSettingsPresentation: React.FC<FlowSettingsPresentationProps> = ({
  flowSettings,
  currentUser,
}) => {
  const flowSettingsModal = useFlowSettingsModal();
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [showExamples, setShowExamples] = useState(false);

  const isAdmin = currentUser?.role === "SUPER-ADMIN";

  const filteredSettings = flowSettings?.filter((setting) => {
    if (filter === "active") return setting.active;
    if (filter === "inactive") return !setting.active;
    return true;
  });

  return (
    <div className="space-y-4">
      <FlowSettingsModal />

      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Account Flow Settings
          </h2>
          <p className="text-muted-foreground">
            Configure automated routing rules for account approval workflows
          </p>
        </div>

        {/* Examples Section */}
        <Collapsible open={showExamples} onOpenChange={setShowExamples}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-fit">
              <Info className="mr-2 h-4 w-4" />
              {showExamples ? "Hide Examples" : "Show Examples"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Example Use Cases</CardTitle>
                <CardDescription>
                  Common scenarios for flow settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-2 border-primary pl-3">
                  <p className="font-medium text-sm">
                    Auto-approve all FAYDA_PASS accounts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Origin: FAYDA_PASS, Documents: ALL, Customer Type: ALL →
                    APPROVED
                  </p>
                </div>
                <div className="border-l-2 border-blue-500 pl-3">
                  <p className="font-medium text-sm">
                    Fast-track DIASPORA_WEB to PENDING
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Origin: DIASPORA_WEB, Documents: ALL, Customer Type:
                    INDIVIDUAL → PENDING
                  </p>
                </div>
                <div className="border-l-2 border-green-500 pl-3">
                  <p className="font-medium text-sm">
                    Auto-approve accounts with PASSPORT
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Origin: ALL, Documents: PASSPORT, Customer Type: ALL →
                    APPROVED
                  </p>
                </div>
                <div className="border-l-2 border-orange-500 pl-3">
                  <p className="font-medium text-sm">
                    Manual review for ORGANIZATION accounts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Origin: ALL, Documents: ALL, Customer Type: ORGANIZATION →
                    PENDING
                  </p>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Select
          value={filter}
          onValueChange={(value) =>
            setFilter(value as "all" | "active" | "inactive")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Rules</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {isAdmin && (
          <Button
            size="sm"
            className="bg-primary"
            onClick={() => flowSettingsModal.onOpen()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Rule
          </Button>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              How Flow Settings Work
            </p>
            <p className="text-xs text-blue-800 dark:text-blue-200">
              Rules are evaluated by priority (highest first). The first matching
              rule determines where the account goes after REGISTERED stage. Only{" "}
              <Badge variant="secondary" className="text-xs">
                SUPER-ADMIN
              </Badge>{" "}
              can create or modify rules.
            </p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        type="flow-settings"
        searchKey="description"
        clickable={false}
        columns={flowSettingsColumns}
        data={filteredSettings || []}
        onUrl={false}
      />

      {/* Empty State */}
      {(!flowSettings || flowSettings.length === 0) && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No flow settings configured
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Create your first rule to start automating account workflows
          </p>
          {isAdmin && (
            <Button
              className="mt-4"
              onClick={() => flowSettingsModal.onOpen()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create First Rule
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FlowSettingsPresentation;

