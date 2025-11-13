import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import {
  useGetOrganizationalAccountByIdQuery,
  useChangeAccountStatusMutation,
  useAuthorizeAccountMutation,
  useUpdateAccountStatusMutation,
  useReverseAuthorizationMutation,
  useVerifyAccountMutation,
  useApproveAccountMutation,
} from "@/features/accounts/accountApiSlice";

import OrganizationalAccountDetailPresentation from "@/components/presentation/OrganizationalAccountPresentation";

const OrganizationalAccountDetailContainer = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();

  if (!accountId) {
    toast.error("Account ID is required.");
    navigate(-1);
    return null;
  }

  const { 
    data: account, 
    isLoading, 
    isError 
  } = useGetOrganizationalAccountByIdQuery(accountId);
  const { data: currentUser } = useGetCurrentUserQuery();

  const [changeAccountStatus] = useChangeAccountStatusMutation();
  const [authorizeAccount] = useAuthorizeAccountMutation();
  const [updateAccountStatus] = useUpdateAccountStatusMutation();
  const [reverseAuthorization] = useReverseAuthorizationMutation();
  const [verifyAccount] = useVerifyAccountMutation();
  const [approveAccount] = useApproveAccountMutation();

  const handleVerifyAccount = async () => {
    if (!account?.accountId) {
      toast.error("Account ID is missing.");
      return;
    }
    try {
      await verifyAccount({ accountId: account.accountId }).unwrap();
      toast.success("Account Verified Successfully.");
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.data?.message || "Unexpected error occurred during verification.");
    }
  };

  const handleUpdateAccountStatus = async (status: string) => {
    if (!account?.accountId) {
      toast.error("Account ID is missing.");
      return;
    }
    if (account.status === "REGISTERED" && status === "UNSETTLED") {
      if (!account.accountNumber || !account.customerId) {
        toast.error("Please verify account before moving to Unsettled.");
        return;
      }
    }
    try {
      await updateAccountStatus({ accountId: account.accountId, status }).unwrap();
      toast.success("Account Status Updated.");
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.data?.message || "Unexpected error occurred while updating status.");
    }
  };

  const handleAuthorizeAccount = async () => {
    if (!account?.accountId) {
      toast.error("Account ID is missing.");
      return;
    }
    if (!account?.accountNumber || !account?.customerId) {
      toast.error("Cannot authorize. Account must be verified first.");
      return;
    }
    try {
      await authorizeAccount({ accountId: account.accountId }).unwrap();
      toast.success("Account Authorized.");
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.data?.message || "Unexpected error occurred.");
    }
  };

  const handleApproveClick = async () => {
    if (!account?.accountId) {
      toast.error("Account ID is missing.");
      return;
    }
    if (!account?.accountNumber || !account?.customerId) {
      toast.error("Cannot approve. Account must be verified first.");
      return;
    }
    try {
      await approveAccount({ accountId: account.accountId }).unwrap();
      toast.success("Account Approved Successfully.");
      navigate(-1);
    } catch (error: any) {
      toast.error(error?.data?.message || "Unexpected error occurred.");
    }
  };

  const handleRejectAccount = async (rejectionReason: string) => {
    if (!account?.id) {
      toast.error("Account ID is missing.");
      return;
    }
    try {
      await changeAccountStatus({
        id: account.id.toString(),
        status: "REJECTED",
        rejectionReason,
      }).unwrap();
      toast.success("Account Rejected.");
      navigate(-1);
    } catch (error: any) {
      toast.error(error?.data?.message || "Unexpected error occurred while rejecting.");
    }
  };

  const handleReverseAuthorization = async () => {
    if (!account?.accountId) {
      toast.error("Account ID is missing.");
      return;
    }
    try {
      await reverseAuthorization({ accountId: account.accountId }).unwrap();
      toast.success("Authorization Reversed.");
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.data?.message || "Error reversing authorization.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading account</div>;

  return (
    <OrganizationalAccountDetailPresentation
      account={
        account
          ? {
              ...account,
              customersInfo: account.customersInfo?.map((c) => ({
                ...c,
                id: String(c.id), // Convert id: number → string
              })),
            }
          : undefined
      }
      currentUser={currentUser}
      onBack={() => navigate(-1)}
      onVerify={handleVerifyAccount}
      onApprove={handleApproveClick}
      onReject={handleRejectAccount}
      onUpdateStatus={handleUpdateAccountStatus}
      onAuthorize={handleAuthorizeAccount}
      onReverseAuthorization={handleReverseAuthorization}
    />
  );
};

export default OrganizationalAccountDetailContainer;