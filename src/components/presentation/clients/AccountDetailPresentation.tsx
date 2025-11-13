import { FC, useState } from "react";
import { IndividualAccount } from "@/features/accounts/accountApiSlice";
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
  MailIcon,
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
  const settleModal = useSettleModal();

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
            onClick={handleVerifyAccount}
          >
            Verify Account
          </Button>
        )}

        {isVerified && account.status === "PENDING" && isCreatorAuthorized && (
          <Button
            className="border bg-cyan-500"
            size="sm"
            onClick={() => handleAuthorizeAccount(account.accountId)}
          >
            Authorize
          </Button>
        )}

        {isVerified && account.status === "AUTHORIZED" && isApproverAuthorized && (
          <>
            <Button
              className="border"
              size="sm"
              variant="destructive"
              onClick={() => setIsRejectDialogOpen(true)}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              className="border bg-cyan-500"
              size="sm"
              onClick={handleApproveClick}
            >
              Approve
            </Button>
          </>
        )}

        {isVerified && account.status === "AUTHORIZED" && isCreatorAuthorized && (
          <Button
            className="border bg-cyan-500"
            size="sm"
            onClick={() => handleReverseAuthorization(account.id)}
          >
            Reverse Authorization
          </Button>
        )}

        {isVerified && account.status === "UNSETTLED" && isCreatorAuthorized && (
          <Button
            className="border"
            size="sm"
            variant="secondary"
            onClick={() => {
              settleModal.onOpen();
            }}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Settle
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

        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {/* Contact Info */}
          <div className="space-y-4">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Contact Information
            </CardTitle>
            <div className="flex items-center space-x-2">
              <MailIcon className="h-5 w-5 text-gray-400" />
              <p className="text-gray-700">{account?.emailVerified}</p>
            </div>
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
          </div>

          {/* Address */}
          <div className="space-y-4">
            <CardTitle className="text-lg font-semibold text-gray-800">
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
          </div>

          {/* Personal Info */}
          <div className="space-y-4">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Personal Information
            </CardTitle>
            <p className="text-gray-700">Surname: {account?.surname}</p>
            <p className="text-gray-700">Mother's Name: {account?.motherName}</p>
            <p className="text-gray-700">Occupation: {account?.occupation}</p>
            <p className="text-gray-700">Sex: {account?.sex}</p>
            <p className="text-gray-700">
              Date of Birth:{" "}
              {account?.dateOfBirth && format(new Date(account.dateOfBirth), "MM/dd/yyyy")}
            </p>
            <p className="text-gray-700">Customer Type: {account?.customerType}</p>
            <p className="text-gray-700">Title: {account?.title}</p>
            <p className="text-gray-700">House No: {account?.houseNo}</p>
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