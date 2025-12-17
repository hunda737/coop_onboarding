import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import {
  useGetIndividualAccountByIdQuery,
  useChangeAccountStatusMutation,
  useAuthorizeAccountMutation,
  useUpdateAccountStatusMutation,
  useReverseAuthorizationMutation,
  useVerifyAccountMutation,
  useApproveAccountMutation,
  useUpdateIndividualAccountMutation,
  IndividualAccount,
} from "@/features/accounts/accountApiSlice";
import AccountDetailPresentation from "@/components/presentation/clients/AccountDetailPresentation";

const AccountDetailContainer = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();

  if (!accountId) {
    toast.error("Account ID is required.");
    return null;
  }

  const { data: individualAccount } = useGetIndividualAccountByIdQuery(accountId);
  const { data: currentUser } = useGetCurrentUserQuery();

  const [changeAccountStatus] = useChangeAccountStatusMutation();
  const [authorizeAccount] = useAuthorizeAccountMutation();
  const [updateAccountStatus] = useUpdateAccountStatusMutation();
  const [reverseAuthorization] = useReverseAuthorizationMutation();

  const [approveAccount] = useApproveAccountMutation();
  const [updateIndividualAccount] = useUpdateIndividualAccountMutation();

  const [verifyAccount] = useVerifyAccountMutation();

  const handleVerifyAccount = async () => {
    if (!individualAccount?.accountId) {
      toast.error("Account ID is missing.");
      return;
    }

    try {
      await verifyAccount({ accountId: individualAccount.accountId }).unwrap();
      toast.success("Account verified successfully.");
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.data?.message || "Verification failed.");
    }
  };



  const handleUpdateAccountStatus = async (status: string) => {
    if (!individualAccount?.accountId) {
      toast.error("Account ID is missing.");
      return;
    }
    if (individualAccount.status === "REGISTERED" && status === "UNSETTLED") {
      if (!individualAccount.accountNumber || !individualAccount.customerId) {
        toast.error("Please verify account before moving to Unsettled.");
        return;
      }
    }
    try {
      await updateAccountStatus({
        accountId: individualAccount.accountId,
        status
      }).unwrap();
      toast.success("Account Status Updated.");
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.data?.message || "Unexpected error occurred while updating status.");
    }
  };

  const handleAuthorizeAccount = async (accountId: number) => {
    if (!individualAccount?.accountNumber || !individualAccount?.customerId) {
      toast.error("Cannot authorize. Account must be verified first.");
      return;
    }
    try {
      await authorizeAccount({ accountId }).unwrap();
      toast.success("Account Authorized.");
    } catch (error: any) {
      toast.error(error?.data?.message || "Unexpected error occurred.");
    }
  };

  const handleApproveClick = async () => {
    if (!individualAccount?.accountId) {
      toast.error("Account ID is missing.");
      return;
    }
    if (!individualAccount?.accountNumber || !individualAccount?.customerId) {
      toast.error("Cannot approve. Account must be verified first.");
      return;
    }
    try {
      await approveAccount({ accountId: individualAccount.accountId }).unwrap();
      toast.success("Account Approved Successfully.");
      navigate(-1);
    } catch (error: any) {
      toast.error(error?.data?.message || "Unexpected error occurred.");
    }

  };

  const handleRejectClick = async (rejectionReason: string) => {
    if (!individualAccount?.accountId) {
      toast.error("Account ID is missing.");
      return;
    }
    try {
      await changeAccountStatus({
        id: individualAccount.accountId.toString(),
        status: "REJECTED",
        rejectionReason,
      }).unwrap();
      toast.success("Account Rejected.");
      navigate(-1);
    } catch (error: any) {
      toast.error(error?.data?.message || "Unexpected error occurred while rejecting.");
    }
  };

  const handleReverseAuthorization = async (accountId: number) => {
    if (!accountId) {
      toast.error("Account ID is missing.");
      return;
    }
    try {
      await reverseAuthorization({ accountId }).unwrap();
      toast.success("Authorization Reversed.");
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.data?.message || "Unexpected error occurred.");
    }
  };

  // Utility function to organize data for API call
  const organizeAccountDataForApi = (updatedData: Partial<IndividualAccount>) => {
    if (!individualAccount) return null;

    // Merge updated data with existing account data to send complete object
    const completeData = { ...individualAccount, ...updatedData };

    // Customer info fields that need customerInfo. prefix
    const customerInfoFields = [
      'fullName', 'surname', 'motherName', 'email', 'phone', 'dateOfBirth',
      'country', 'state', 'city', 'streetAddress', 'zipCode', 'occupation',
      'title', 'maritalStatus', 'postCode', 'zoneSubCity', 'houseNo',
      'documentName', 'issueAuthority', 'issueDate', 'expiryDate',
      'employeeStatus', 'legalId', 'salary', 'sector', 'industry',
      'employerName', 'monthlyIncome', 'sex', 'photo', 'residenceCard', 'signature', 'residenceCardBack'
    ];

    const formData = new FormData();

    Object.entries(completeData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Determine the field name to use in FormData
        const fieldName = customerInfoFields.includes(key) ? `customerInfo.${key}` : key;

        if (value instanceof File) {
          formData.append(fieldName, value);
        } else if (typeof value === 'object') {
          formData.append(fieldName, JSON.stringify(value));
        } else {
          formData.append(fieldName, String(value));
        }
      }
    });

    return formData;
  };

  const handleUpdateIndividualAccount = async (updatedData: Partial<IndividualAccount>) => {
    if (!individualAccount?.id) {
      toast.error("Individual account ID is missing.");
      return;
    }

    try {
      const organizedData = organizeAccountDataForApi(updatedData);
      if (!organizedData) {
        toast.error("Failed to organize account data.");
        return;
      }

      await updateIndividualAccount({
        id: individualAccount.id.toString(),
        formData: organizedData,
      }).unwrap();
      toast.success("Individual account updated successfully.");
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.data?.message || "Update failed.");
    }
  };

  if (!individualAccount) {
    return <p>Loading account data...</p>;
  }

  return (
    <AccountDetailPresentation
      account={individualAccount}
      handleApproveClick={handleApproveClick}
      handleRejectClick={handleRejectClick}
      handleAuthorizeAccount={handleAuthorizeAccount}
      handleUpdateAccountStatus={handleUpdateAccountStatus}
      handleReverseAuthorization={handleReverseAuthorization}
      handleVerifyAccount={handleVerifyAccount}
      handleUpdateIndividualAccount={handleUpdateIndividualAccount}
      currentUser={currentUser}
    />
  );
};

export default AccountDetailContainer;
