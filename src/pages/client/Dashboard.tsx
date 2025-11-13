import { SADashboardContainer, CADashboardContainer } from "@/components/container/dashboard";
import UserDashboardContainer from "@/components/container/UserDashboardContainer";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";



const DashboardPage = () => {
  const { data: currentUser, isLoading, isError, error } = useGetCurrentUserQuery();

  // Handle the loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle the error state
  if (isError) {
    console.error(error); // Log the error for debugging
    return <div>Error loading user data</div>;
  }

  // Handle the case where user data is available
  console.log('Current User:', currentUser);  // You can see the user object here.

  return (
    <div className="p-5">
      {/* Conditionally render based on user role */}
      {currentUser?.role === "SUPER-ADMIN" ||
        currentUser?.role === "ADMIN" ||
        currentUser?.role === "CRM" ? (
        <SADashboardContainer />
      ) : currentUser?.role === "ACCOUNT-CREATOR" ||
        currentUser?.role === "CLIENT-ADMIN" ||
        currentUser?.role === "BRANCH-ADMIN" ? (
        <UserDashboardContainer />
      ) : currentUser?.role === "ACCOUNT-APPROVER" ? (
        <CADashboardContainer />
      ) : (
        <div>No Access</div> // Default case for other roles
      )}
    </div>
  );
};

export default DashboardPage;




