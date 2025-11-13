import React from "react";
import { useParams } from "react-router-dom";
import { useGetTaskByIdQuery } from "@/features/tasks/tasksApiSlice";

type TaskStatus = "TO_DO" | "IN_PROGRESS" | "COMPLETE" | "CANCELED";

const isTaskStatus = (status: string): status is TaskStatus => {
  return ["TO_DO", "IN_PROGRESS", "COMPLETE", "CANCELED"].includes(status);
};

const TaskDetails = () => {
  const { taskId } = useParams();
  const { data: task, isLoading, isError } = useGetTaskByIdQuery(Number(taskId));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-gray-300 rounded-full"></div>
        <p className="ml-4">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Failed to load task details.</p>
      </div>
    );
  }

  if (task) {
    return (
      <div className="w-full max-w-6xl mx-auto my-10 p-6 bg-white border rounded-lg shadow-md">
        <header className="text-center mb-6">
          <h6 className="text-2xl font-bold text-gray-800">{task.title}</h6>
          <p className="text-gray-600 mt-2">
            {task.description || "No description available."}
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DetailItem label="CRM Name" value={task.crmName || "N/A"} />
          <DetailItem label="Address" value={task.address || "N/A"} />
          <DetailItem
            label="Status"
            value={<StatusBadge status={task.status} />}
          />
          <DetailItem label="Task Date" value={formatDate(task.taskDate)} />
          <DetailItem label="Task Time" value={task.taskTime || "N/A"} />
          <DetailItem label="Created At" value={formatDate(task.createdAt)} />
          <DetailItem label="Updated At" value={formatDate(task.updatedAt)} />
        </section>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>No task details available.</p>
    </div>
  );
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="p-4 bg-gray-50 border rounded-lg">
    <h2 className="text-sm font-semibold text-gray-500">{label}</h2>
    <p className="text-gray-800 mt-1">{value}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  if (!isTaskStatus(status)) {
    return (
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-300 text-gray-700">
        Unknown
      </span>
    );
  }

  const statusStyles: Record<TaskStatus, string> = {
    TO_DO: "bg-blue-500 text-white",
    IN_PROGRESS: "bg-yellow-500 text-white",
    COMPLETE: "bg-green-500 text-white",
    CANCELED: "bg-red-500 text-white",
  };

  const statusText: Record<TaskStatus, string> = {
    TO_DO: "To Do",
    IN_PROGRESS: "In Progress",
    COMPLETE: "Completed",
    CANCELED: "Canceled",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        statusStyles[status]
      }`}
    >
      {statusText[status]}
    </span>
  );
};

export default TaskDetails;
