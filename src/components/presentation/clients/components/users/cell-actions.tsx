import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal, Edit } from "lucide-react";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useDeleteAccountMutation } from "@/features/accounts/accountApiSlice";
// import { useNavigate } from "react-router-dom";
import { AlertModal } from "@/components/ui/modals/alert-modal";
import { User, useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import { useUserModal } from "@/hooks/use-user-modal";

interface CellActionProps {
  data: User;
}
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [deleteAccount] = useDeleteAccountMutation();
  const userModal = useUserModal();
  const { data: currentUser } = useGetCurrentUserQuery();
  
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("client ID copied to the clipboard");
  };
  
  const onEdit = () => {
    userModal.setEditData({
      id: data.userId,
      email: data.email,
      role: data.role,
      mainBranchId: data.mainBranch?.id,
      status: data.status,
    });
    userModal.onEdit();
  };
  
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  // Check if current user is admin or super admin
  const canEdit = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER-ADMIN";

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteAccount(data.userId.toString()).unwrap();
      toast.success("Account deleted.");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setOpen(false);
    }
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
          <DropdownMenuItem onClick={() => onCopy(data.userId.toString())}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          {canEdit && (
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}
          {/* <DropdownMenuItem
            // onClick={() => router.push(`/admin/accounts/${data.id.toString()}`)}
            onClick={() => navigate(`${data.userId.toString()}`)}
          >
            <Backpack className="mr-2 h-4 w-4" />
            Detail
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
