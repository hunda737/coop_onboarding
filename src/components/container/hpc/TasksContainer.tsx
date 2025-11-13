// import TaskPresentation from "@/components/presentation/hpc/TaskPresentation";
// import { useGetTasksQuery } from "@/features/tasks/tasksApiSlice";

// const TaskContainer = () => {
//   const { data: tasksData, error, isLoading } = useGetTasksQuery();

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error loading tasks. Please try again later.</div>;
//   }

//   // console.log("Tasks Data:", tasksData);  // Log the data to inspect the response

//   return (
//     <div className="p-5">
//       <TaskPresentation taskData={tasksData} />
//     </div>
//   );
// };

// export default TaskContainer;
