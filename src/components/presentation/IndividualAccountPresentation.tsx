import { FC, useState } from "react";
import { IndividualAccount } from "@/features/accounts/accountApiSlice";
import { format } from "date-fns";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  CheckCheck,
  HomeIcon,
  MailIcon,
  PhoneIcon,
  X,
  CalendarIcon,
  BriefcaseIcon,
  DollarSignIcon,
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
import { User as CurrentUser } from "@/features/user/userApiSlice";

type IndividualAccountDetailPresentationProps = {
  account: IndividualAccount | undefined;
  handleApproveClick: () => void;
  handleRejectClick: (rejectionReason: string) => void;
  handleReverseAuthorization: (accountId: number) => Promise<void>;
  handleUpdateAccountStatus: (status: string) => Promise<void>;
  handleAuthorizeAccount: (accountId: number) => Promise<void>;
  currentUser: CurrentUser | undefined;
};

const IndividualAccountDetailPresentation: FC<IndividualAccountDetailPresentationProps> = ({
  account,
  handleRejectClick,
  handleApproveClick,
  handleReverseAuthorization,
  handleAuthorizeAccount,
  currentUser,
}) => {
  const navigate = useNavigate();
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const settleModal = useSettleModal();

  const confirmRejection = () => {
    handleRejectClick(rejectionReason);
    setIsRejectDialogOpen(false);
    setRejectionReason("");
  };

  const renderActionButtons = () => {
    if (!account || !currentUser) return null;

    const isCreatorAuthorized = isRoleAuthorized(currentUser.role, [
      "ACCOUNT_CREATOR",
    ]);
    const isApproverAuthorized = isRoleAuthorized(currentUser.role, [
      "ACCOUNT_APPROVER",
    ]);

    if (account.status === "AUTHORIZED" && isApproverAuthorized) {
      return (
        <div className="flex items-center">
          <Button
            className="ml-2 border"
            size="sm"
            variant="destructive"
            onClick={() => setIsRejectDialogOpen(true)}
          >
            <X className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button
            className="ml-2 border bg-cyan-500"
            size="sm"
            onClick={handleApproveClick}
          >
            Approve
          </Button>
        </div>
      );
    }

    if (account.status === "PENDING" && isCreatorAuthorized) {
      return (
        <div className="flex items-center">
          <Button
            className="ml-2 border bg-cyan-500"
            size="sm"
            onClick={() => handleAuthorizeAccount(account.id)}
          >
            Authorize
          </Button>
        </div>
      );
    }

    if (account.status === "AUTHORIZED" && isCreatorAuthorized) {
      return (
        <div className="flex items-center">
          <Button
            className="ml-2 border bg-cyan-500"
            size="sm"
            onClick={() => handleReverseAuthorization(account.id)}
          >
            Reverse Authorization
          </Button>
        </div>
      );
    }

    if (account.status === "UNSETTLED" && isCreatorAuthorized) {
      return (
        <Button
          className="ml-2 border"
          size="sm"
          variant="secondary"
          onClick={() => {
            settleModal.onOpen();
           navigate('/accounts');
;
          }}
        >
          <CheckCheck className="mr-2 h-4 w-4" />
          Settle
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="flex w-full justify-center">
      <SettleModal
        selectedAccountIds={[account?.id || 0]}
        amount={account?.initialDeposit || 0}
      />
      <Card className="w-full rounded-xl shadow-lg bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-x-6 p-6 border-b">
          <div className="flex space-x-6 items-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-8 w-8 text-gray-500" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                {account?.fullName}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Badge
                  variant={
                    account?.status === "PENDING" ? "secondary" : "default"
                  }
                >
                  {account?.status}
                </Badge>
                <Badge variant="outline">{account?.accountType}</Badge>
              </div>
            </div>
          </div>
          <div className="text-2xl text-primary">{account?.accountId}</div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          <div className="space-y-4">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Personal Information
            </CardTitle>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <p className="text-gray-700">
                DOB: {account?.dateOfBirth && format(new Date(account.dateOfBirth), "MM/dd/yyyy")}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <MailIcon className="h-5 w-5 text-gray-400" />
              <p className="text-gray-700">Mother: {account?.motherName}</p>
            </div>
            <p className="text-gray-700">Title: {account?.title}</p>
            <p className="text-gray-700">Marital Status: {account?.maritalStatus}</p>
            {account?.sex && <p className="text-gray-700">Gender: {account.sex}</p>}
          </div>

          <div className="space-y-4">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Contact Information
            </CardTitle>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
              <p className="text-gray-700">{account?.phone}</p>
            </div>
            <div className="flex items-center space-x-2">
              <HomeIcon className="h-5 w-5 text-gray-400" />
              <p className="text-gray-700">
                {account?.streetAddress}, {account?.city}
              </p>
            </div>
            <p className="text-gray-700">
              {account?.state}, {account?.country}
            </p>
            <p className="text-gray-700">Postal Code: {account?.postCode}</p>
          </div>

          <div className="space-y-4">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Financial Information
            </CardTitle>
            <div className="flex items-center space-x-2">
              <DollarSignIcon className="h-5 w-5 text-gray-400" />
              <p className="text-gray-700">
                Initial Deposit: {account?.currency} {Number(account?.initialDeposit).toFixed(2)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <BriefcaseIcon className="h-5 w-5 text-gray-400" />
              <p className="text-gray-700">Occupation: {account?.occupation}</p>
            </div>
            <p className="text-gray-700">
              Monthly Income: {account?.currency} {Number(account?.monthlyIncome).toFixed(2)}
            </p>
            <p className="text-gray-700">Branch: {account?.branch}</p>
          </div>
        </CardContent>

        {/* Employment Information Section */}
        <CardContent className="p-6 border-t">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Employment Details
          </CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-gray-700 font-medium">Employer</p>
              <p className="text-gray-600">{account?.employerName || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-700 font-medium">Industry</p>
              <p className="text-gray-600">{account?.industry || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-700 font-medium">Salary</p>
              <p className="text-gray-600">
                {account?.currency} {Number(account?.salary).toFixed(2) || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>

        {/* Document Information Section */}
        {account?.documentName && (
          <CardContent className="p-6 border-t">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Identification Document
            </CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-gray-700 font-medium">Document Type</p>
                <p className="text-gray-600">{account.documentName}</p>
              </div>
              <div>
                <p className="text-gray-700 font-medium">Issue Date</p>
                <p className="text-gray-600">
                  {account.issueDate && format(new Date(account.issueDate), "MM/dd/yyyy")}
                </p>
              </div>
              <div>
                <p className="text-gray-700 font-medium">Expiry Date</p>
                <p className="text-gray-600">
                  {account.expirayDate && format(new Date(account.expirayDate), "MM/dd/yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        )}

        {/* Rejection Reason Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reason for Rejection</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this account.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Enter rejection reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-4"
            />
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setIsRejectDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmRejection}
                disabled={!rejectionReason.trim()}
              >
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Action Buttons */}
        <CardContent className="p-6 border-t">
          <div className="flex items-center justify-end border-t pt-5">
            <Button
              className="ml-2 border"
              size="sm"
              onClick={() => navigate(-1)}
              variant="secondary"
            >
              Cancel
            </Button>
            {renderActionButtons()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndividualAccountDetailPresentation;