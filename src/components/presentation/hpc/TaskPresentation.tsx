import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TaskList from "./components/tasks/tasklists";
import { useTaskModal } from "@/hooks/use-task-modal";
import { TaskModal } from "@/components/ui/modals/taskmodal";

export default function TaskPresentation() {
  const taskModal = useTaskModal();

  return (
    <div>
      <TaskModal open={taskModal.isOpen} onClose={taskModal.onClose} />

      <div className="flex items-center justify-between pb-2 -mb-2">
        <div></div>
        <div>
          <Button
            size="sm"
            className="bg-primary mt-2 mr-4 p-2"
            onClick={() => taskModal.onOpen()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="-mt-2">
        <TaskList />
      </div>
    </div>
  );
}

