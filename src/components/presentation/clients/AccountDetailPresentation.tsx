import { FC, useState } from "react";
import { IndividualAccount, useUpdateCustomerInfoMutation } from "@/features/accounts/accountApiSlice";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCheck,
  HomeIcon,
  PhoneIcon,
  X,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useSettleModal } from "@/hooks/use-settle-modal";
import { SettleModal } from "@/components/ui/modals/settle-modal";
import { isRoleAuthorized } from "@/types/authorities";
import { User } from "@/features/user/userApiSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";

type AccountDetailPresentationProps = {
  account: IndividualAccount | undefined;
  handleApproveClick: () => Promise<void>;
  handleRejectClick: (rejectionReason: string) => Promise<void>;
  handleAuthorizeAccount: (accountId: number) => Promise<void>;
  handleUpdateAccountStatus: (status: string) => Promise<void>;
  handleReverseAuthorization: (accountId: number) => Promise<void>;
  handleVerifyAccount: () => Promise<void>;
  handleUpdateIndividualAccount: (updatedData: Partial<IndividualAccount>) => Promise<void>;
  currentUser: User | undefined;
};

const AccountDetailPresentation: FC<AccountDetailPresentationProps> = ({
  account,
  handleRejectClick,
  handleApproveClick,
  handleReverseAuthorization,
  handleAuthorizeAccount,
  handleVerifyAccount,
  handleUpdateIndividualAccount,
  currentUser,
}) => {
  const navigate = useNavigate();
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedAccount, setEditedAccount] = useState<Partial<IndividualAccount>>({});
  const [isMergeDialogOpen, setIsMergeDialogOpen] = useState(false);
  const settleModal = useSettleModal();
  const [updateCustomerInfo, { isLoading: isMerging }] = useUpdateCustomerInfoMutation();

  // Loading states for buttons
  const [loadingStates, setLoadingStates] = useState({
    verify: false,
    authorize: false,
    approve: false,
    reject: false,
    reverseAuthorization: false,
    settle: false,
  });

  const confirmRejection = () => {
    handleRejectClick(rejectionReason);
    setIsRejectDialogOpen(false);
    setRejectionReason("");
  };

  const handleEditClick = () => {
    if (account) {
      setEditedAccount({
        ...account,
        dateOfBirth: account.dateOfBirth ? format(new Date(account.dateOfBirth), "yyyy-MM-dd") : "",
        issueDate: account.issueDate ? format(new Date(account.issueDate), "yyyy-MM-dd") : "",
        expirayDate: account.expirayDate ? format(new Date(account.expirayDate), "yyyy-MM-dd") : "",
      });
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveChanges = async () => {
    await handleUpdateIndividualAccount(editedAccount);
    setIsEditDialogOpen(false);
  };

  // Helper function to format CBO date string (YYYYMMDD) to readable format
  const formatCboDate = (dateStr: string | undefined): string => {
    if (!dateStr || dateStr.length !== 8) return "";
    try {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return format(new Date(`${year}-${month}-${day}`), "MM/dd/yyyy");
    } catch {
      return dateStr;
    }
  };

  // Helper function to check if values match
  const valuesMatch = (val1: any, val2: any): boolean => {
    if (val1 === val2) return true;
    if (!val1 || !val2) return false;
    return String(val1).toLowerCase().trim() === String(val2).toLowerCase().trim();
  };

  const handleButtonClick = async (action: string, callback: () => Promise<void>) => {
    setLoadingStates((prev) => ({ ...prev, [action]: true }));
    try {
      await callback();
    } finally {
      setLoadingStates((prev) => ({ ...prev, [action]: false }));
    }
  };

  const renderActionButtons = () => {
    if (!account || !currentUser) return null;

    const isCreatorAuthorized = isRoleAuthorized(currentUser.role, ["ACCOUNT-CREATOR"]);
    const isApproverAuthorized = isRoleAuthorized(currentUser.role, ["ACCOUNT-APPROVER"]);
    const isVerified = account.customerId && account.accountNumber;

    return (
      <div className="flex items-center flex-wrap gap-2">
        <Button
          className="border"
          size="sm"
          onClick={() => navigate(-1)}
          variant="secondary"
        >
          Cancel
        </Button>

        {isCreatorAuthorized && (
          <Button
            className="border"
            size="sm"
            variant="outline"
            onClick={handleEditClick}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Details
          </Button>
        )}

        {!isVerified && isCreatorAuthorized && account?.status !== "APPROVED" && (
          <Button
            className="border bg-yellow-500 hover:bg-yellow-600 text-white"
            size="sm"
            onClick={() => handleButtonClick("verify", handleVerifyAccount)}
            disabled={loadingStates.verify}
          >
            {loadingStates.verify ? "Verifying..." : "Verify Account"}
          </Button>
        )}

        {isVerified && account.status === "PENDING" && isCreatorAuthorized && (
          <Button
            className="border bg-cyan-500"
            size="sm"
            onClick={() => handleButtonClick("authorize", () => handleAuthorizeAccount(account.accountId))}
            disabled={loadingStates.authorize}
          >
            {loadingStates.authorize ? "Authorizing..." : "Authorize"}
          </Button>
        )}

        {isVerified && account.status === "AUTHORIZED" && isApproverAuthorized && (
          <>
            <Button
              className="border"
              size="sm"
              variant="destructive"
              onClick={() => setIsRejectDialogOpen(true)}
              disabled={loadingStates.reject}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              className="border bg-cyan-500"
              size="sm"
              onClick={() => handleButtonClick("approve", handleApproveClick)}
              disabled={loadingStates.approve}
            >
              {loadingStates.approve ? "Approving..." : "Approve"}
            </Button>
          </>
        )}

        {isVerified && account.status === "AUTHORIZED" && isCreatorAuthorized && (
          <Button
            className="border bg-cyan-500"
            size="sm"
            onClick={() => handleButtonClick("reverseAuthorization", () => handleReverseAuthorization(account.id))}
            disabled={loadingStates.reverseAuthorization}
          >
            {loadingStates.reverseAuthorization ? "Reversing..." : "Reverse Authorization"}
          </Button>
        )}

        {isVerified && account.status === "UNSETTLED" && isCreatorAuthorized && (
          <Button
            className="border"
            size="sm"
            variant="secondary"
            onClick={() => {
              handleButtonClick("settle", async () => {
                settleModal.onOpen();
              });
            }}
            disabled={loadingStates.settle}
          >
            {loadingStates.settle ? "Settling..." : "Settle"}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="flex w-full justify-center">
      <SettleModal
        selectedAccountIds={[account?.accountId || 0]}
        amount={account?.initialDeposit || 0}
      />

      <Card className="w-full rounded-xl shadow-lg bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-x-6 p-6 border-b">
          <div className="flex space-x-6 items-center">
            <img
              src={account?.photo}
              alt="Photo"
              className="w-32 h-32 rounded-lg shadow-md"
            />
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                {account?.fullName}
              </CardTitle>
              <CardTitle className="text-sm font-semibold text-gray-700">
                Account ID: {account?.accountId}
              </CardTitle>
              <CardTitle className="text-sm font-semibold text-gray-700">
                Account Number: {account?.accountNumber}
              </CardTitle>
              <CardTitle className="text-sm font-semibold text-gray-700">
                Customer ID: {account?.id}
              </CardTitle>
              <Badge
                variant={account?.status === "PENDING" ? "secondary" : "default"}
                className="mt-2"
              >
                {account?.status}
              </Badge>
            </div>
          </div>
          <div className="text-xl font-medium text-primary">
            {account?.accountType}
          </div>

        </CardHeader>

        {/* CBO Account Comparison - Only show if account exists */}
        {account?.haveCboAccount && account?.customerUserInfo && (
          <CardContent className="border-t bg-blue-50/30 p-6">
            <div className="mb-6">
              <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                CBO Account Comparison
              </CardTitle>
              <p className="text-sm text-gray-600">
                Compare the National id data with the existing CBO account data
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Onboarding Data - Only comparable fields */}
              <div className="space-y-4 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between pb-3 border-b">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    National Id Data
                  </CardTitle>
                  <Badge variant="outline" className="bg-blue-50">NEW</Badge>
                </div>

                {/* Personal Information */}
                <div className="space-y-3">
                  <CardTitle className="text-base font-semibold text-gray-700">Personal Information</CardTitle>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Full Name</p>
                    <p className={`text-gray-700 ${!valuesMatch(account?.fullName, account?.customerUserInfo?.fullName) ? "font-semibold text-orange-600" : ""}`}>
                      {account?.fullName || "N/A"} {account?.surname || ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Gender/Sex</p>
                    <p className={`text-gray-700 ${!valuesMatch(account?.sex, account?.customerUserInfo?.gender) ? "font-semibold text-orange-600" : ""}`}>
                      {account?.sex || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Date of Birth</p>
                    <p className={`text-gray-700 ${!valuesMatch(
                      account?.dateOfBirth ? format(new Date(account.dateOfBirth), "yyyyMMdd") : "",
                      account?.customerUserInfo?.dateOfBirthStr
                    ) ? "font-semibold text-orange-600" : ""}`}>
                      {account?.dateOfBirth ? format(new Date(account.dateOfBirth), "MM/dd/yyyy") : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-3 pt-4 border-t">
                  <CardTitle className="text-base font-semibold text-gray-700">Address</CardTitle>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">City</p>
                    <p className={`text-gray-700 ${!valuesMatch(account?.zoneSubCity || account?.city, account?.customerUserInfo?.addressCity) ? "font-semibold text-orange-600" : ""}`}>
                      {account?.zoneSubCity || account?.city || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Country</p>
                    <p className={`text-gray-700 ${!valuesMatch(account?.country, account?.customerUserInfo?.addressCountry) ? "font-semibold text-orange-600" : ""}`}>
                      {account?.country || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* CBO Account Data - Only comparable fields */}
              <div className="space-y-4 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between pb-3 border-b">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    CBO Account Data
                  </CardTitle>
                  <Badge variant="outline" className="bg-green-50">EXISTING</Badge>
                </div>

                {/* Personal Information */}
                <div className="space-y-3">
                  <CardTitle className="text-base font-semibold text-gray-700">Personal Information</CardTitle>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Full Name</p>
                    <p className={`text-gray-700 ${!valuesMatch(account?.fullName, account?.customerUserInfo?.fullName) ? "font-semibold text-orange-600" : ""}`}>
                      {account?.customerUserInfo?.fullName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Gender</p>
                    <p className={`text-gray-700 ${!valuesMatch(account?.sex, account?.customerUserInfo?.gender) ? "font-semibold text-orange-600" : ""}`}>
                      {account?.customerUserInfo?.gender || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Date of Birth</p>
                    <p className={`text-gray-700 ${!valuesMatch(
                      account?.dateOfBirth ? format(new Date(account.dateOfBirth), "yyyyMMdd") : "",
                      account?.customerUserInfo?.dateOfBirthStr
                    ) ? "font-semibold text-orange-600" : ""}`}>
                      {account?.customerUserInfo?.dateOfBirthStr ? formatCboDate(account.customerUserInfo.dateOfBirthStr) : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-3 pt-4 border-t">
                  <CardTitle className="text-base font-semibold text-gray-700">Address</CardTitle>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">City</p>
                    <p className={`text-gray-700 ${!valuesMatch(account?.zoneSubCity || account?.city, account?.customerUserInfo?.addressCity) ? "font-semibold text-orange-600" : ""}`}>
                      {account?.customerUserInfo?.addressCity || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Country</p>
                    <p className={`text-gray-700 ${!valuesMatch(account?.country, account?.customerUserInfo?.addressCountry) ? "font-semibold text-orange-600" : ""}`}>
                      {account?.customerUserInfo?.addressCountry || "N/A"}
                    </p>
                  </div>
                </div>


                {/* External Accounts - Only show if CBO account exists */}
                <div className="space-y-3 p-2">
                  {account?.haveCboAccount && account?.customerUserInfo?.externalAccounts && account.customerUserInfo.externalAccounts.length > 0 && (
                    <CardContent className="border-t">
                      <CardTitle className="text-lg font-semibold text-gray-800 mb-4">
                        External Accounts (CBO)
                      </CardTitle>
                      <div className="">
                        {account.customerUserInfo.externalAccounts.map((extAccount) => (
                          <div key={extAccount.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="font-medium text-gray-700 mb-2">{extAccount.accountTitle}</p>
                            <div className="space-y-1 text-sm">
                              <p className="text-gray-600"><span className="font-medium">Account:</span> {extAccount.accountNumber}</p>
                              <p className="text-gray-600"><span className="font-medium">Branch:</span> {extAccount.branchName}</p>
                              <p className="text-gray-500 text-xs"><span className="font-medium">Co Code:</span> {extAccount.coCode}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </div>
              </div>
            </div>

            {/* add button to merge the infomration */}
            <div className="flex items-center justify-center py-4">
              <Button 
                className="border bg-cyan-500" 
                size="sm"
                onClick={() => setIsMergeDialogOpen(true)}
              >
                Merge Information
              </Button>
            </div>
          </CardContent>
        )}

        {/* Additional Account Details - Always shown below comparison or as main content */}
        <CardContent className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6 ${account?.haveCboAccount ? 'border-t' : ''}`}>
          {/* Personal Information */}
          <div className="space-y-6">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Personal Information
            </CardTitle>
            <p className="text-gray-700">Full Name: {account?.fullName}</p>
            <p className="text-gray-700">Surname: {account?.surname}</p>
            <p className="text-gray-700">Mother's Name: {account?.motherName}</p>
            <p className="text-gray-700">Sex: {account?.sex}</p>
            <p className="text-gray-700">
              Date of Birth:{" "}
              {account?.dateOfBirth && format(new Date(account.dateOfBirth), "MM/dd/yyyy")}
            </p>
            <p className="text-gray-700">Customer Type: {account?.customerType}</p>
            <p className="text-gray-700">Title: {account?.title}</p>
            <p className="text-gray-700">House No: {account?.houseNo}</p>
          </div>

          {/* Contact & Address Information */}
          <div className="space-y-6">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Contact Information
            </CardTitle>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
              <p className="text-gray-700">{account?.phone}</p>
            </div>
            <Badge
              variant={account?.emailVerified ? "default" : "destructive"}
              className="mt-3"
            >
              Email Verified: {account?.emailVerified ? "Yes" : "No"}
            </Badge>

            <CardTitle className="text-lg font-semibold text-gray-800 mt-6">
              Address
            </CardTitle>
            <div className="flex items-center space-x-2">
              <HomeIcon className="h-5 w-5 text-gray-400" />
              <p className="text-gray-700">{account?.streetAddress}</p>
            </div>
            <p className="text-gray-700">
              {account?.zoneSubCity}, {account?.state} {account?.zipCode}
            </p>
            <p className="text-gray-500">{account?.country}</p>
            <p className="text-gray-700">Occupation: {account?.occupation}</p>
          </div>
        </CardContent>


        {/* Financial and Employer Info */}
        <CardContent className="grid border-t grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          <div className="space-y-4">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Financial Information
            </CardTitle>
            <p className="text-gray-700">
              Initial Deposit: {account?.currency} {Number(account?.initialDeposit).toFixed(2)}
            </p>
            {/* <p className="text-gray-700">
              Monthly Income: {account?.currency} {Number(account?.monthlyIncome).toFixed(2)}
            </p> */}
            <p className="text-gray-700">Salary: {account?.currency} {Number(account?.salary).toFixed(2)}</p>
          </div>

          <div className="space-y-4">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Employment & Account Info
            </CardTitle>
            <p className="text-gray-700">Employer: {account?.employerName}</p>
            <p className="text-gray-700">Sector: {account?.sector}</p>
            <p className="text-gray-700">Industry: {account?.industry}</p>
            <p className="text-gray-700">
              Branch: {account?.branch}
            </p>
            <p className="text-gray-700">
              Added by: {account?.addedByFullName} ({account?.addedByRole})
            </p>
            <p className="text-gray-500">
              Created At: {account?.createdAt && format(new Date(account.createdAt), "MM/dd/yyyy")}
            </p>
          </div>

          {/* ID & Legal Info */}
          <div className="space-y-4">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Legal & ID Information
            </CardTitle>
            <p className="text-gray-700">Legal ID: {account?.legalId}</p>
            <p className="text-gray-700">Document Name: {account?.documentName}</p>
            <p className="text-gray-700">
              Issue Date: {account?.issueDate && format(new Date(account.issueDate), "MM/dd/yyyy")}
            </p>
            <p className="text-gray-700">
              Expiry Date: {account?.expirayDate && format(new Date(account.expirayDate), "MM/dd/yyyy")}
            </p>
          </div>
        </CardContent>

        {/* ID & Signature */}
        <CardContent className="grid border-t grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Signature
            </CardTitle>
            <img
              src={account?.signature}
              alt="Signature"
              className="w-80 h-40 rounded-lg shadow-md"
            />
          </div>
          {/* Hide if document name is "NATIONAL ID"*/}
          {account?.documentName === "NATIONAL ID" ? (
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800">
                ID Front
              </CardTitle>
              <img
                src={account?.residenceCard}
                alt="Residence Card"
                className="w-80 h-40 rounded-lg shadow-md"
              />
            </div>
          ) : null}
          {account?.documentName === "NATIONAL ID" ? (
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800">
                ID Back
              </CardTitle>
              <img
                src={account?.residenceCardBack}
                alt="Residence Card Back"
                className="w-80 h-40 rounded-lg shadow-md"
              />
            </div>
          ) : null}
        </CardContent>

        <CardContent className="p-6 border-t">
          <div className="flex items-center justify-end border-t pt-5">
            {renderActionButtons()}
          </div>
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Rejection</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this account
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRejection}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Merge Confirmation Dialog */}
      <Dialog open={isMergeDialogOpen} onOpenChange={setIsMergeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Merge</DialogTitle>
            <DialogDescription>
              Are you sure you want to merge? This will replace the customer data on core banking with the data from fayda.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMergeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-cyan-500 hover:bg-cyan-600"
              onClick={async () => {
                if (!account?.id) {
                  toast.error("Account ID is missing");
                  return;
                }

                try {
                  const response = await updateCustomerInfo({ accountId: account.id }).unwrap();
                  
                  // Check the response structure from backend
                  if (response?.success === true) {
                    toast.success(response?.message || "Customer information merged successfully");
                    setIsMergeDialogOpen(false);
                  } else {
                    // Handle case where success is false (shouldn't happen with 200, but just in case)
                    toast.error(response?.error || "Failed to merge customer information");
                    setIsMergeDialogOpen(false);
                  }
                } catch (error: any) {
                  // Handle error response from backend (400 status)
                  // RTK Query puts the response body in error.data
                  const errorResponse = error?.data;
                  
                  // Extract error message from the response
                  let errorMessage = "Failed to merge customer information";
                  
                  if (errorResponse) {
                    if (errorResponse.error) {
                      errorMessage = errorResponse.error;
                    } else if (errorResponse.message) {
                      errorMessage = errorResponse.message;
                    } else if (typeof errorResponse === 'string') {
                      errorMessage = errorResponse;
                    }
                  } else if (error?.message) {
                    errorMessage = error.message;
                  }
                  
                  toast.error(errorMessage);
                  
                  // Close dialog even on error
                  setIsMergeDialogOpen(false);
                }
              }}
              disabled={isMerging}
            >
              {isMerging ? "Merging..." : "Confirm Merge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer Details</DialogTitle>
            <DialogDescription>
              Update the customer information below
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Personal Information</h3>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editedAccount.fullName || ""}
                  maxLength={30}
                  onChange={(e) => setEditedAccount({ ...editedAccount, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Surname</Label>
                <Input
                  value={editedAccount.surname || ""}
                  maxLength={30}
                  onChange={(e) => setEditedAccount({ ...editedAccount, surname: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Mother's Name</Label>
                <Input
                  value={editedAccount.motherName || ""}
                  maxLength={30}
                  onChange={(e) => setEditedAccount({ ...editedAccount, motherName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={editedAccount.dateOfBirth || ""}
                  onChange={(e) => setEditedAccount({ ...editedAccount, dateOfBirth: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Sex</Label>
                <Select
                  value={editedAccount.sex || ""}
                  onValueChange={(value) => setEditedAccount({ ...editedAccount, sex: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Contact Information</h3>


            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Address Information</h3>
              <div className="space-y-2">
                <Label>Street Address</Label>
                <Input
                  maxLength={30}
                  value={editedAccount.streetAddress || ""}
                  onChange={(e) => setEditedAccount({ ...editedAccount, streetAddress: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Zone/Sub-City</Label>
                <Input
                  maxLength={30}
                  value={editedAccount.zoneSubCity || ""}
                  onChange={(e) => setEditedAccount({ ...editedAccount, zoneSubCity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  maxLength={30}
                  value={editedAccount.state || ""}
                  onChange={(e) => setEditedAccount({ ...editedAccount, state: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Zip Code</Label>
                <Input
                  maxLength={30}
                  value={editedAccount.zipCode || ""}
                  onChange={(e) => setEditedAccount({ ...editedAccount, zipCode: e.target.value })}
                />
              </div>
            </div>

            {/* Employment Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Employment Information</h3>
              <div className="space-y-2">
                <Label>Occupation</Label>
                <Input
                  maxLength={30}
                  value={editedAccount.occupation || ""}
                  onChange={(e) => setEditedAccount({ ...editedAccount, occupation: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Employer Name</Label>
                <Input
                  maxLength={30}
                  value={editedAccount.employerName || ""}
                  onChange={(e) => setEditedAccount({ ...editedAccount, employerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Sector</Label>
                <Input
                  maxLength={30}
                  value={editedAccount.sector || ""}
                  onChange={(e) => setEditedAccount({ ...editedAccount, sector: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input
                  maxLength={30}
                  value={editedAccount.industry || ""}
                  onChange={(e) => setEditedAccount({ ...editedAccount, industry: e.target.value })}
                />
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Financial Information</h3>
              <div className="space-y-2">
                <Label>Monthly Income</Label>
                <Input
                  type="number"
                  value={editedAccount.monthlyIncome || ""}
                  onChange={(e) => setEditedAccount({ ...editedAccount, monthlyIncome: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Salary</Label>
                <Input
                  type="number"
                  value={editedAccount.salary || ""}
                  onChange={(e) => setEditedAccount({ ...editedAccount, salary: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* ID Information */}
            <div className="space-y-4">
              <h3 className="font-medium">ID Information</h3>
              <div className="space-y-2">
                <Label>Legal ID</Label>
                <Input
                  maxLength={30}
                  value={editedAccount.legalId || ""}
                  onChange={(e) => setEditedAccount({ ...editedAccount, legalId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Document Name</Label>
                <Input
                  maxLength={30}
                  value={editedAccount.documentName || ""}
                  onChange={(e) => setEditedAccount({ ...editedAccount, documentName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Issue Date</Label>
                <Input
                  type="date"
                  value={editedAccount.issueDate || ""}
                  onChange={(e) => setEditedAccount({ ...editedAccount, issueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={editedAccount.expirayDate || ""}
                  onChange={(e) => setEditedAccount({ ...editedAccount, expirayDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountDetailPresentation;