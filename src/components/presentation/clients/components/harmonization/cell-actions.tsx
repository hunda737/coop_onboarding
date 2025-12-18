import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Backpack, Copy, MoreHorizontal } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Harmonization } from "@/features/harmonization/harmonizationApiSlice";

interface CellActionProps {
  data: Harmonization;
}

export const HarmonizationCellAction: React.FC<CellActionProps> = ({ data }) => {
  const navigate = useNavigate();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Harmonization ID copied to clipboard");
  };

  const getDetailRoute = () => {
    return `/harmonization/${data.id}`;
  };

  return (
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


