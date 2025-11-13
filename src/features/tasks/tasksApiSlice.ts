import { apiSlice } from "../api/apiSlice";

// TaskResponse interface
interface TaskResponse {
  taskId: number;
  highProfileCustomerName: string;
  crmName: string;
  taskDate: string; // Format: "YYYY-MM-DD"
  taskTime: string; // Format: "HH:mm:ss"
  title: string | null;
  description: string | null;
  address: string | null;
  reminder: boolean;
  status: string; // e.g., "TO_DO", "IN_PROGRESS", "COMPLETE"
  createdAt: string;
  updatedAt: string;
}

// Request interface for creating a new task
interface CreateTaskRequest {
  highProfileCustomerId: number;
  taskDate: string; 
  taskTime: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  title: string;
  description: string;
  address: string;
  reminder: boolean;
  status: string; // Default: "TO_DO"
}

// Request interface for updating an existing task
interface UpdateTaskRequest {
  taskId: number;
  title?: string;
  description?: string;
  address?: string;
  reminder?: boolean;
  status?: string;
}

export const tasksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<TaskResponse[], void>({
      query: () => ({
        url: "/api/v1/tasks", // Endpoint for tasks
      }),
      providesTags: [{ type: "Task", id: "TASK_LIST" }],
    }),

    // Fetch a task by ID
    getTaskById: builder.query<TaskResponse, number>({
      query: (taskId) => ({
        url: `/api/v1/tasks/${taskId}`, // Fetch task by ID
      }),
      providesTags: (_, __) => [{ type: "Task", id: "TASK_LIST" }],
    }),

    // Create a new task
    createTask: builder.mutation<TaskResponse, CreateTaskRequest>({
      query: (taskData) => ({
        url: "/api/v1/tasks", 
        method: "POST",
        body: taskData,
      }),
      invalidatesTags: [{ type: "Task", id: "TASK_LIST" }],
    }),

    // Update an existing task
    updateTask: builder.mutation<TaskResponse, UpdateTaskRequest>({
      query: ({ taskId, ...rest }) => ({
        url: `/api/v1/tasks/update?taskId=${taskId}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: (_, __) => [{ type: "Task", id: "TASK_LIST" }],
    }),

    // Delete an existing task
    deleteTask: builder.mutation<void, number>({
      query: (taskId) => ({
        url: `/api/v1/tasks?taskId=${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Task", id: "TASK_LIST" }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApiSlice;

export type { TaskResponse, CreateTaskRequest, UpdateTaskRequest };
