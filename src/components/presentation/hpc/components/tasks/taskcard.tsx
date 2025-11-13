import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const TaskCard = ({
  task,
  onEdit,
  onDelete,
}: {
  task: any;
  onEdit: (task: any) => void;
  onDelete: (taskId: number) => void;
}) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDetailsClick = () => {
    navigate(`/tasks/${task.taskId}`);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleActionClick = (action: "edit" | "delete" | "details") => {
    setIsDropdownOpen(false); 
    switch (action) {
      case "edit":
        onEdit(task);
        break;
      case "delete":
        onDelete(task.taskId);
        break;
      case "details":
        handleDetailsClick();
        break;
    }
  };

  return (
    <Card className="rounded-md border border-gray-200 bg-white hover:shadow-md transition-shadow duration-150">
      <CardHeader className="px-4 py-2 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h6 className="font-medium text-gray-800 truncate">{task.title || "Untitled Task"}</h6>
          <span className="text-sm text-gray-500">
            {format(new Date(task.updatedAt), "MM/dd/yyyy HH:mm")}
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-3">
        <p className="text-sm text-gray-700 line-clamp-2">{task.description || "No description provided."}</p>
      </CardContent>
      <div className="px-4 py-2 border-t border-gray-200 flex justify-between items-center">
      <span
  className={`text-xs font-medium px-2 py-1 rounded ${
    task.status === "Complete"
      ? "bg-green-100 text-green-800"
      : task.status === "In Progress"
      ? "bg-yellow-100 text-yellow-800"
      : task.status === "To Do"
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-100 text-gray-800"
  }`}
>
  {task.status}
</span>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            •••
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-300 rounded-md shadow-md z-10">
              <button
                onClick={() => handleActionClick("edit")}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => handleActionClick("delete")}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Delete
              </button>
              <button
                onClick={() => handleActionClick("details")}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Details
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
