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
  
  ArrowLeftIcon,
  CheckIcon,
  XIcon,
  ShieldCheckIcon,
  ShieldOffIcon,
  RefreshCwIcon,
  Building2Icon,
  FileTextIcon,
  LandmarkIcon,
  MapPinIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

interface OrganizationalCustomerInfo {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

interface OrganizationalAccount {
  accountNumber?: string;
  accountType?: string;
  status?: string;
  addedByFullName?: string;
  addedByRole?: string;
  customersInfo?: OrganizationalCustomerInfo[];
  accountId?: number;
  initialDeposit?: number;
  branch?: string;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
  companyName?: string;
  companyEmail?: string;
  companyPhoneNumber?: string;
  companyTinNumber?: string;
  companyTarget?: string;
  companyResidence?: string;
  companyState?: string;
  companyZone?: string;
  companySubCity?: string;
  companyWoreda?: string;
}

interface OrganizationalAccountDetailPresentationProps {
  account?: OrganizationalAccount;
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

const OrganizationalAccountDetailPresentation: React.FC<OrganizationalAccountDetailPresentationProps> = ({
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

  if (!account) return <p>No Organizational Account found.</p>;

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
              Organizational Account Details
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Information */}
            <Card className="border rounded-lg p-4 shadow-sm bg-gray-50">
              <CardTitle className="text-lg font-semibold mb-4 flex items-center">
                <Building2Icon className="mr-2 h-5 w-5" />
                Company Information
              </CardTitle>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <FileTextIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Company Name:</p>
                    <p>{account.companyName || "N/A"}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <MailIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Company Email:</p>
                    <p>{account.companyEmail || "N/A"}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <PhoneIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Company Phone:</p>
                    <p>{account.companyPhoneNumber || "N/A"}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <LandmarkIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">TIN Number:</p>
                    <p>{account.companyTinNumber || "N/A"}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <MapPinIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Company Address:</p>
                    <p>
                      {account.companyResidence || "N/A"}, {account.companySubCity || ""}, {account.companyZone || ""}
                    </p>
                    <p>
                      {account.companyWoreda ? `Woreda: ${account.companyWoreda}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Authorized Representatives */}
            {account.customersInfo && account.customersInfo.length > 0 && (
              <Card className="border rounded-lg p-4 shadow-sm bg-gray-50">
                <CardTitle className="text-lg font-semibold mb-4 flex items-center">
                  <UserIcon className="mr-2 h-5 w-5" />
                  Authorized Representatives
                </CardTitle>
                
                <div className="space-y-4">
                  {account.customersInfo.map((customer) => (
                    <div key={customer.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <p className="font-medium">{customer.fullName}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <MailIcon className="h-4 w-4" />
                          <p>{customer.email || "N/A"}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <PhoneIcon className="h-4 w-4" />
                          <p>{customer.phone || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
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

export default OrganizationalAccountDetailPresentation;