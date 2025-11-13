import React from "react";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MailIcon,
  PhoneIcon,
  UserIcon,
  CalendarIcon,
  ArrowLeftIcon,
  CheckIcon,
  XIcon,
  ShieldCheckIcon,
  ShieldOffIcon,
  RefreshCwIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

interface CustomerInfo {
  id: string;
  fullName: string;
  surname: string;
  email: string;
  phone: string;
  occupation: string;
  dateOfBirth: string;
  motherName?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  monthlyIncome?: number;
  sex?: string;
  title?: string;
  maritalStatus?: string;
}

interface JointAccount {
  accountNumber?: string;
  accountType?: string;
  status?: string;
  addedByFullName?: string;
  addedByRole?: string;
  customersInfo: CustomerInfo[];
  accountId?: number;
  initialDeposit?: number;
  branch?: string;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface JointAccountDetailPresentationProps {
  account?: JointAccount;
  currentUser?: any;
  onBack?: () => void;
  onVerify?: () => void;
  onApprove?: () => void;
  onReject?: (reason: string) => void;
  onUpdateStatus?: (status: string) => void;
  onAuthorize?: () => void;
  onReverseAuthorization?: () => void;
}

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "REGISTERED", label: "Registered" },
  { value: "VERIFIED", label: "Verified" },
  { value: "AUTHORIZED", label: "Authorized" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "UNSETTLED", label: "Unsettled" },
  { value: "SETTLED", label: "Settled" },
];

const JointAccountDetailPresentation: React.FC<JointAccountDetailPresentationProps> = ({
  account,
  
  onBack,
  onVerify,
  onApprove,
  onReject,
  onUpdateStatus,
  onAuthorize,
  onReverseAuthorization,
}) => {
  const [rejectionReason, setRejectionReason] = React.useState("");
  const [, setSelectedStatus] = React.useState(account?.status || "");

  if (!account) return <p>No Joint Account found.</p>;

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    if (onUpdateStatus) {
      onUpdateStatus(status);
    }
  };

  const handleReject = () => {
    if (onReject && rejectionReason.trim()) {
      onReject(rejectionReason);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <Button variant="outline" className="w-fit" onClick={onBack}>
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="rounded-xl shadow-lg bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-x-6 p-6 border-b">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Joint Account Details
            </CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-gray-600">Account Number: {account.accountNumber || "N/A"}</p>
                <p className="text-gray-600">Account Type: {account.accountType || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600">Initial Deposit: {account.initialDeposit || "N/A"}</p>
                <p className="text-gray-600">Branch: {account.branch || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600">Currency: {account.currency || "N/A"}</p>
                <p className="text-gray-600">Status: 
                  <Badge variant="outline" className="ml-2">
                    {account.status || "N/A"}
                  </Badge>
                </p>
              </div>
            </div>
          </div>
          {account.addedByFullName && (
            <div className="text-gray-700 text-right">
              <p>
                Added By: <strong>{account.addedByFullName}</strong> ({account.addedByRole || "N/A"})
              </p>
              <p className="text-sm text-gray-500">
                Created: {account.createdAt ? format(new Date(account.createdAt), "PPpp") : "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                Updated: {account.updatedAt ? format(new Date(account.updatedAt), "PPpp") : "N/A"}
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-6">
          <CardTitle className="text-xl font-semibold text-gray-800 mb-4">
            Account Holders Information
          </CardTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {account.customersInfo.map((customer) => (
              <Card key={customer.id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                <p className="text-lg font-semibold text-gray-900">
                  {customer.title && `${customer.title} `}
                  {customer.fullName} {customer.surname}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <MailIcon className="h-5 w-5" />
                      <p>{customer.email || "N/A"}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <PhoneIcon className="h-5 w-5" />
                      <p>{customer.phone || "N/A"}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <UserIcon className="h-5 w-5" />
                      <p>{customer.occupation || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <CalendarIcon className="h-5 w-5" />
                      <p>
                        {customer.dateOfBirth
                          ? format(new Date(customer.dateOfBirth), "MM/dd/yyyy")
                          : "N/A"}
                      </p>
                    </div>
                    {customer.motherName && (
                      <p className="text-gray-700">Mother: {customer.motherName}</p>
                    )}
                    {customer.maritalStatus && (
                      <p className="text-gray-700">Marital Status: {customer.maritalStatus}</p>
                    )}
                  </div>
                </div>

                {customer.streetAddress && (
                  <div className="mt-4">
                    <p className="font-medium text-gray-700">Address:</p>
                    <p className="text-gray-600">
                      {customer.streetAddress}, {customer.city}, {customer.state}, {customer.country}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </CardContent>

        <CardContent className="p-6 border-t flex flex-wrap justify-end gap-2">
          {onVerify && (
            <Button variant="default" onClick={onVerify}>
              <CheckIcon className="mr-2 h-4 w-4" />
              Verify Account
            </Button>
          )}

          {onApprove && (
            <Button variant="default" onClick={onApprove}>
              <ShieldCheckIcon className="mr-2 h-4 w-4" />
              Approve Account
            </Button>
          )}

          {onReject && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <XIcon className="mr-2 h-4 w-4" />
                  Reject Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Account</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Input
                      id="rejectionReason"
                      placeholder="Enter rejection reason"
                      className="col-span-4"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="destructive" onClick={handleReject}>
                    Confirm Rejection
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {onAuthorize && (
            <Button variant="default" onClick={onAuthorize}>
              <ShieldCheckIcon className="mr-2 h-4 w-4" />
              Authorize Account
            </Button>
          )}

          {onReverseAuthorization && (
            <Button variant="outline" onClick={onReverseAuthorization}>
              <ShieldOffIcon className="mr-2 h-4 w-4" />
              Reverse Authorization
            </Button>
          )}

          {onUpdateStatus && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <RefreshCwIcon className="mr-2 h-4 w-4" />
                  Update Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onSelect={() => handleStatusChange(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JointAccountDetailPresentation;