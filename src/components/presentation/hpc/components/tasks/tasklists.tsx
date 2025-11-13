import { useState } from "react";
import {
  useGetTasksQuery,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/features/tasks/tasksApiSlice";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-hot-toast";
import TaskCard from "./taskcard";

const TaskList = () => {
  const { data: tasks = [], isLoading, isError } = useGetTasksQuery();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    status: "",
  });

  const groupedTasks: Record<"To Do" | "In Progress" | "Completed" | "Canceled", any[]> = {
    "To Do": tasks.filter((task: any) => task.status === "TO_DO"),
    "In Progress": tasks.filter((task: any) => task.status === "IN_PROGRESS"),
    Completed: tasks.filter((task: any) => task.status === "COMPLETE"),
    Canceled: tasks.filter((task: any) => task.status === "CANCELED"),
  };

  const statuses: ("To Do" | "In Progress" | "Completed" | "Canceled")[] = [
    "To Do",
    "In Progress",
    "Completed",
    "Canceled",
  ];

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setFormValues({
      title: task.title,
      description: task.description,
      status: task.status,
    });
  };

  const handleEditSubmit = async () => {
    try {
      await updateTask({ ...editingTask, ...formValues });
      toast.success("Task updated successfully");
      setEditingTask(null);
    } catch {
      toast.error("Failed to update task");
    }
  };

  type Status = "To Do" | "In Progress" | "Completed" | "Canceled";

const handleDragEnd = async (result: any) => {
  const { source, destination } = result;
  if (!destination) return;

  const sourceStatus = source.droppableId as Status;
  const destStatus = destination.droppableId as Status;

  if (sourceStatus === destStatus) return;

  const sourceTasks = [...groupedTasks[sourceStatus]];
  const task = sourceTasks[source.index];

  const updatedStatus =
    destStatus === "Completed"
      ? "COMPLETE"
      : destStatus.toUpperCase().replace(" ", "_");

  try {
    await updateTask({ ...task, status: updatedStatus });
    toast.success(`Task moved to ${destStatus}`);
  } catch (error) {
    console.error("Error updating task status:", error);
    toast.error("Failed to move task");
  }
};

  
  

  const handleDelete = (taskId: any) => {
    deleteTask(taskId)
      .then(() => toast.success("Task deleted"))
      .catch(() => toast.error("Failed to delete task"));
  };

  if (isLoading) return <p>Loading tasks...</p>;
  if (isError) return <p>Failed to load tasks</p>;

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-6">
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
                  style={{
                    maxHeight: "800px",
                    overflowY: "auto",
                  }}
                >
                  <h4 className="font-bold text-lg mb-4 text-cyan-500">
                    {status} ({groupedTasks[status].length})
                  </h4>

                  {groupedTasks[status].map((task, index) => (
                    <Draggable draggableId={String(task.taskId)} index={index} key={task.taskId}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-3"
                        >
                          <TaskCard
                            task={task}
                            onEdit={handleEdit}
                            onDelete={() => handleDelete(task.taskId)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={formValues.title}
                onChange={(e) =>
                  setFormValues({ ...formValues, title: e.target.value })
                }
                className="w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={formValues.description}
                onChange={(e) =>
                  setFormValues({ ...formValues, description: e.target.value })
                }
                className="w-full border-gray-300 rounded-md shadow-sm p-2"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Status</label>
              <select
                value={formValues.status}
                onChange={(e) =>
                  setFormValues({ ...formValues, status: e.target.value })
                }
                className="w-full border-gray-300 rounded-md shadow-sm p-2"
              >
                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status.toUpperCase().replace(" ", "_")}
                  >
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setEditingTask(null)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="bg-cyan-500 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskList;
