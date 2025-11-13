import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { AlertModal } from "@/components/ui/modals/alert-modal";
import { AccountFlowSettings } from "@/features/account-flow-settings/accountFlowSettingsApiSlice";
import { useDeleteFlowSettingMutation } from "@/features/account-flow-settings/accountFlowSettingsApiSlice";
import { useFlowSettingsModal } from "@/hooks/use-flow-settings-modal";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";

interface CellActionProps {
  data: AccountFlowSettings;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const flowSettingsModal = useFlowSettingsModal();
  const [deleteFlowSetting] = useDeleteFlowSettingMutation();
  const { data: currentUser } = useGetCurrentUserQuery();

  const isAdmin = currentUser?.role === "SUPER-ADMIN";

  const onEdit = () => {
    flowSettingsModal.onOpen(data);
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteFlowSetting(data.id).unwrap();
      toast.success("Flow setting deleted successfully");
    } catch (error: unknown) {
      // @ts-expect-error error type
      toast.error(error?.data?.message || "Failed to delete flow setting");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

