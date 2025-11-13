import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Backpack, Copy, MoreHorizontal, StopCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Client,
  useToggleClientStatusMutation,
} from "@/features/client/clientApiSlice";
import { useNavigate } from "react-router-dom";
import { SuspendAlertModal } from "@/components/ui/modals/suspend-alert-modal";
import { Button } from "@/components/ui/button";

interface CellActionProps {
  data: Client;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const navigate = useNavigate();
  const [toggleClientStatus] = useToggleClientStatusMutation();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const isClientActive = data.status === "ACTIVE";
  const actionLabel = isClientActive ? "Suspend" : "Activate";
  const confirmMessage = isClientActive
    ? "Do you want to suspend this client?"
    : "Do you want to activate this client?";

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Client ID copied to the clipboard");
  };

  const onToggleStatus = async () => {
    try {
      setLoading(true);
      await toggleClientStatus(data.id.toString()).unwrap();
      toast.success(`Client ${isClientActive ? "suspended" : "activated"}.`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <SuspendAlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onToggleStatus}
        loading={loading}
        message={confirmMessage}
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
          <DropdownMenuItem onClick={() => onCopy(data.id.toString())}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`/clients/${data.id}`)}>
            <Backpack className="mr-2 h-4 w-4" />
            Preview
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <StopCircle className="mr-2 h-4 w-4" />
            {actionLabel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
