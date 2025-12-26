import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus, Download, Loader2 } from "lucide-react";
import { userColumns } from "./components/users/user-column";
import { User, useGetCurrentUserQuery, useLazyExportUsersDataQuery } from "@/features/user/userApiSlice";
import { FC, useState } from "react";
import { UserModal } from "@/components/ui/modals/user-modal";
import { useUserModal } from "@/hooks/use-user-modal";
import { Client } from "@/features/client/clientApiSlice";
import { toast } from "react-hot-toast";

type UserPresentationProps = {
  users: User[] | undefined;
  clientId: number;
  client: Client | undefined;
  isLoading?: boolean;
};
const UserPresentation: FC<UserPresentationProps> = ({
  users,
  clientId,
  client,
  isLoading = false,
}) => {
  const userModal = useUserModal();
  const { data: currentUser } = useGetCurrentUserQuery();
  const [isExporting, setIsExporting] = useState(false);
  const [exportUsersData] = useLazyExportUsersDataQuery();

  const isExportAuthorized = currentUser?.role === "ADMIN" || currentUser?.role === "SUPER-ADMIN";

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportUsersData().unwrap();
      
      // Create a download link
      const url = window.URL.createObjectURL(result);
      const link = document.createElement("a");
      link.href = url;
      const currentDate = new Date().toISOString().split('T')[0];
      link.download = `users-export-${currentDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Export completed successfully");
    } catch (error: any) {
      console.error("Export error:", error);
      toast.error(error?.data?.message || "Failed to export users data");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      {clientId && client && <UserModal clientId={clientId} client={client} />}
      <div className="flex items-center justify-between mb-4 pb-2 relative z-10">
        <div></div>
        <div className="p-2 flex gap-2">
          {isExportAuthorized && (
            <Button
              size="sm"
              className="bg-primary relative z-20"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </>
              )}
            </Button>
          )}
          {(currentUser?.role === "ADMIN" || currentUser?.role === "SUPER-ADMIN") && (
            <Button
              size="sm"
              className="bg-primary relative z-20"
              onClick={() => userModal.onOpen()}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          )} 
        </div>
      </div>
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">Loading...</span>
            </div>
          </div>
        )}
        <DataTable
          type="client"
          searchKey="fullName"
          clickable={true}
          columns={userColumns}
          data={users || []}
          onUrl={false}
        />
      </div>
    </div>
  );
};

export default UserPresentation;
