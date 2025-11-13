import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useState } from "react";
// import { deleteUser } from "@/actions/user-action";
import { useAgentModal } from "@/hooks/use-user-modal";
import { Agent } from "@/features/agents/agentApiSlice";
import { AlertModal } from "@/components/ui/modals/alert-modal";
// import { useSession } from "next-auth/react";

interface CellActionProps {
  data: Agent;
}
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const agentModal = useAgentModal();
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("client ID copied to the clipboard");
  };
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);

  const onDelete = async () => {
    // try {
    //   setLoading(true);
    //   await deleteUser(data.userId.toString());
    //   router.refresh();
    //   toast.success("User deleted.");
    // } catch (error) {
    //   toast.error("Something went wrong!");
    // } finally {
    //   setLoading(false);
    //   setOpen(false);
    // }
  };

  const onEdit = async (data: Agent) => {
    // Extract branchIds from the data
    const branchIds = data.branches?.map((branch: { id: number }) =>
      branch.id.toString()
    ); // Convert to string if necessary

    // const statusEnum = UserStatus[data.status as keyof typeof UserStatus] !== undefined
    //   ? UserStatus[data.status as keyof typeof UserStatus]
    //   : UserStatus.PENDING;

    agentModal.setEditData({
      fullName: data.fullName ?? "",
      email: data.email ?? "",
      branchIds: branchIds.length > 0 ? branchIds : [],
      status: data.status ?? "",
      id: data.userId ?? 0,
    });
    // Open the modal in edit mode
    agentModal.onEdit();
  };

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
          <DropdownMenuItem onClick={() => onEdit(data)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCopy(data.userId.toString())}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
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
