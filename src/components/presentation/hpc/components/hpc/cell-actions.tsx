import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Info, MoreHorizontal } from "lucide-react";
import { toast } from "react-hot-toast";

import { HighProfileCustomerResponse } from "@/features/hpc/hpcApiSlice";
import { useNavigate } from "react-router-dom";

interface CellActionProps {
  data: HighProfileCustomerResponse;
}
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const navigate = useNavigate();
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("HPC ID copied to the clipboard");
  };

  return (
    <>
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
          <DropdownMenuItem onClick={() => navigate(`${data.id}`)}>
            <Info className="mr-2 h-4 w-4" />
            Detail
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
