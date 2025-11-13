// components/cell-actions.tsx

import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";
import { TaskResponse } from "@/features/tasks/tasksApiSlice";

type CellActionProps = {
  data: TaskResponse;
};

export const CellAction = ({ data }: CellActionProps) => {
  const handleEdit = () => {
    // Logic for editing the task
    // console.log("Editing task", data);
  };

  console.log("data", data);

  const handleDelete = () => {
    // Logic for deleting the task
    // console.log("Deleting task", data);
  };

  return (
    <div className="flex space-x-2">
      <Button variant="ghost" onClick={handleEdit} aria-label="Edit">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" onClick={handleDelete} aria-label="Delete">
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
