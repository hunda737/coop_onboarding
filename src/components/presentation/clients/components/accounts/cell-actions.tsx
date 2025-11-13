import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Backpack, Copy, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useDeleteAccountMutation } from "@/features/accounts/accountApiSlice";
import { useNavigate } from "react-router-dom";
import { AlertModal } from "@/components/ui/modals/alert-modal";

interface AccountData {
  id: number | string;
  customerType?: string;
}

interface CellActionProps {
  data: AccountData;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [deleteAccount] = useDeleteAccountMutation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Account ID copied to clipboard");
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteAccount(data.id.toString()).unwrap();
      toast.success("Account deleted.");
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  // Route based on customerType
  const getDetailRoute = () => {
    switch ((data.customerType || "").toLowerCase()) {
      case "joint":
        return `/joint-accounts/${data.id}`;
      case "organization":
        return `/organizational-accounts/${data.id}`;
      default:
        return `/accounts/${data.id}`;
    }
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id.toString())}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(getDetailRoute())}>
            <Backpack className="mr-2 h-4 w-4" />
            Preview
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
