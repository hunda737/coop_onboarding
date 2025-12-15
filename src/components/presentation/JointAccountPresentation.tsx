import { FC, useState } from "react";
import { JointAccount } from "@/features/accounts/accountApiSlice";
import { format } from "date-fns";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MailIcon,
  PhoneIcon,
  User,
  CalendarIcon,
  BriefcaseIcon,
  DollarSignIcon,
  HomeIcon,
  FileTextIcon,
  X,
  CheckCheck,
  Loader2,
  ZoomIn,
  File,
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

type JointAccountDetailPresentationProps = {
  account: JointAccount | undefined;
  handleApproveClick: () => void;
  handleRejectClick: (rejectionReason: string) => void;
  handleReverseAuthorization: (accountId: number) => Promise<void>;
  handleUpdateAccountStatus: (status: string) => Promise<void>;
  handleAuthorizeAccount: (accountId: number) => Promise<void>;
  handleVerifyAccount: () => Promise<void>;
  currentUser: CurrentUser | undefined;
};

const JointAccountDetailPresentation: FC<JointAccountDetailPresentationProps> = ({
  account,
  handleRejectClick,
  handleApproveClick,
  handleReverseAuthorization,
  handleAuthorizeAccount,
  handleVerifyAccount,
  currentUser,
}) => {
  const navigate = useNavigate();
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [zoomedImageTitle, setZoomedImageTitle] = useState<string>("");
  const [isPdf, setIsPdf] = useState<boolean>(false);
  const settleModal = useSettleModal();

  // Helper function to check if URL is a PDF
  const isPdfFile = (url: string): boolean => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.endsWith('.pdf') || lowerUrl.includes('.pdf?') || lowerUrl.includes('application/pdf');
  };

  // Loading states for buttons
  const [loadingStates, setLoadingStates] = useState({
    verify: false,
    authorize: false,
    approve: false,
    reject: false,
    reverseAuthorization: false,
    settle: false,
  });

  if (!account) {
    return <div className="flex w-full justify-center p-6">No Joint Account found.</div>;
  }

  const confirmRejection = async () => {
    try {
      await handleRejectClick(rejectionReason);
      setIsRejectDialogOpen(false);
      setRejectionReason("");
    } catch (error) {
      // Error handling is done in the container
    }
  };

  // Helper function to handle button clicks with loading states
  const handleButtonClick = async (
    action: keyof typeof loadingStates,
    handler: () => Promise<void> | void
  ) => {
    setLoadingStates((prev) => ({ ...prev, [action]: true }));
    try {
      await handler();
    } finally {
      setLoadingStates((prev) => ({ ...prev, [action]: false }));
    }
  };

  const renderActionButtons = () => {
    if (!account || !currentUser) return null;

    const isCreatorAuthorized = isRoleAuthorized(currentUser.role, [
      "ACCOUNT-CREATOR",
    ]);
    const isApproverAuthorized = isRoleAuthorized(currentUser.role, [
      "ACCOUNT-APPROVER",
    ]);

    // Approver can approve or reject AUTHORIZED accounts
    if (account.status === "AUTHORIZED" && isApproverAuthorized) {
      return (
        <div className="flex items-center">
          <Button
            className="ml-2 border"
            size="sm"
            variant="destructive"
            onClick={() => setIsRejectDialogOpen(true)}
            disabled={loadingStates.reject || loadingStates.approve}
          >
            {loadingStates.reject ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <X className="mr-2 h-4 w-4" />
            )}
            Reject
          </Button>
          <Button
            className="ml-2 border bg-cyan-500"
            size="sm"
            onClick={() => handleButtonClick("approve", handleApproveClick)}
            disabled={loadingStates.approve || loadingStates.reject}
          >
            {loadingStates.approve ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Approve
          </Button>
        </div>
      );
    }

    // Creator can authorize PENDING accounts
    if (account.status === "PENDING" && isCreatorAuthorized) {
      return (
        <div className="flex items-center">
          <Button
            className="ml-2 border bg-cyan-500"
            size="sm"
            onClick={() => handleButtonClick("authorize", () => handleAuthorizeAccount(account.accountId))}
            disabled={loadingStates.authorize}
          >
            {loadingStates.authorize ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Authorize
          </Button>
        </div>
      );
    }

    // Creator can verify REGISTERED accounts
    if (account.status === "REGISTERED" && isCreatorAuthorized) {
      return (
        <div className="flex items-center">
          <Button
            className="ml-2 border bg-cyan-500"
            size="sm"
            onClick={() => handleButtonClick("verify", handleVerifyAccount)}
            disabled={loadingStates.verify}
          >
            {loadingStates.verify ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Verify
          </Button>
        </div>
      );
    }

    // Creator can authorize VERIFIED accounts
    if (account.status === "VERIFIED" && isCreatorAuthorized) {
      return (
        <div className="flex items-center">
          <Button
            className="ml-2 border bg-cyan-500"
            size="sm"
            onClick={() => handleButtonClick("authorize", () => handleAuthorizeAccount(account.accountId))}
            disabled={loadingStates.authorize}
          >
            {loadingStates.authorize ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Authorize
          </Button>
        </div>
      );
    }

    // Creator can reverse authorization on AUTHORIZED accounts
    if (account.status === "AUTHORIZED" && isCreatorAuthorized) {
      return (
        <div className="flex items-center">
          <Button
            className="ml-2 border bg-cyan-500"
            size="sm"
            onClick={() => handleButtonClick("reverseAuthorization", () => handleReverseAuthorization(account.accountId))}
            disabled={loadingStates.reverseAuthorization}
          >
            {loadingStates.reverseAuthorization ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Reverse Authorization
          </Button>
        </div>
      );
    }

    // Creator can settle UNSETTLED accounts
    if (account.status === "UNSETTLED" && isCreatorAuthorized) {
      return (
        <Button
          className="ml-2 border"
          size="sm"
          variant="secondary"
          onClick={() => {
            settleModal.onOpen();
            navigate('/accounts');
          }}
          disabled={loadingStates.settle}
        >
          {loadingStates.settle ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCheck className="mr-2 h-4 w-4" />
          )}
          Settle
        </Button>
      );
    }

    return null;
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
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <Users className="h-8 w-8 text-gray-500" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Joint Account
              </CardTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Badge
                  variant={
                    account?.status === "REGISTERED" || account?.status === "PENDING" ? "secondary" : "default"
                  }
                >
                  {account?.status}
                </Badge>
                <Badge variant="outline">{account?.accountType}</Badge>
                {(account as any)?.jointAccountType && (
                  <Badge variant="outline">{(account as any).jointAccountType}</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {/* Account Information */}
          <div className="space-y-4">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <FileTextIcon className="mr-2 h-5 w-5" />
              Account Information
            </CardTitle>
            <div className="flex items-center space-x-2">
              <FileTextIcon className="h-5 w-5 text-gray-400" />
              <p className="text-gray-700">Account ID: {account?.accountId || "N/A"}</p>
            </div>
            {account?.accountNumber && (
              <p className="text-gray-700">
                Account Number: {account.accountNumber}
              </p>
            )}
            {account?.customerId && (
              <p className="text-gray-700">
                Customer ID: {account.customerId}
              </p>
            )}
            {(account as any)?.jointAccountType && (
              <p className="text-gray-700">
                Joint Type: {(account as any).jointAccountType}
              </p>
            )}
            {account?.addedByFullName && (
              <p className="text-gray-700">
                Added By: {account.addedByFullName} ({account.addedByRole || "N/A"})
              </p>
            )}
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <DollarSignIcon className="mr-2 h-5 w-5" />
              Financial Information
            </CardTitle>
            <div className="flex items-center space-x-2">
              <DollarSignIcon className="h-5 w-5 text-gray-400" />
              <p className="text-gray-700">
                Initial Deposit: {account?.currency || "ETB"} {Number(account?.initialDeposit || 0).toFixed(2)}
              </p>
            </div>
            <p className="text-gray-700">
              Currency: {account?.currency || "ETB"}
            </p>
            <p className="text-gray-700">
              Branch: {account?.branch || "N/A"}
            </p>
          </div>

          {/* Account Metadata */}
          <div className="space-y-4">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Account Details
            </CardTitle>
            {account?.createdAt && (
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <p className="text-gray-700">
                  Created: {format(new Date(account.createdAt), "MM/dd/yyyy")}
                </p>
              </div>
            )}
            {account?.updatedAt && (
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <p className="text-gray-700">
                  Updated: {format(new Date(account.updatedAt), "MM/dd/yyyy")}
                </p>
              </div>
            )}
            {account?.emailVerified !== undefined && (
              <p className="text-gray-700">
                Email Verified: <Badge variant={account.emailVerified ? "default" : "secondary"}>
                  {account.emailVerified ? "Yes" : "No"}
                </Badge>
              </p>
            )}
          </div>
        </CardContent>

        {/* Account Holders Section */}
        {account?.customersInfo && account.customersInfo.length > 0 && (
          <CardContent className="p-6 border-t">
            <CardTitle className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Account Holders ({account.customersInfo.length})
            </CardTitle>
            <div className="flex flex-col gap-6 mt-4">
              {account.customersInfo.map((customer, index) => (
                <Card key={customer.id || index} className="border rounded-lg p-6 shadow-sm bg-gray-50 w-full">
                  <div className="space-y-4">
                    {/* Name Header */}
                    <div className="flex items-center space-x-2 pb-3 border-b">
                      <User className="h-5 w-5 text-gray-400" />
                      <p className="font-semibold text-gray-800 text-lg">
                        {customer.title && `${customer.title} `}
                        {customer.fullName} {customer.surname}
                      </p>
                    </div>
                    
                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Personal Information */}
                      <div className="space-y-3">
                        <p className="font-medium text-gray-700 text-sm mb-2">Personal Information</p>
                        {customer.dateOfBirth && (
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <p className="text-gray-700 text-sm">
                              DOB: {format(new Date(customer.dateOfBirth), "MM/dd/yyyy")}
                            </p>
                          </div>
                        )}
                        {customer.motherName && (
                          <p className="text-gray-700 text-sm">
                            Mother: {customer.motherName}
                          </p>
                        )}
                        {customer.title && (
                          <p className="text-gray-700 text-sm">
                            Title: {customer.title}
                          </p>
                        )}
                        {customer.sex && (
                          <p className="text-gray-700 text-sm">
                            Gender: {customer.sex}
                          </p>
                        )}
                        {customer.maritalStatus && (
                          <p className="text-gray-700 text-sm">
                            Marital Status: {customer.maritalStatus}
                          </p>
                        )}
                        {customer.legalId && (
                          <p className="text-gray-700 text-sm">
                            Legal ID: {customer.legalId}
                          </p>
                        )}
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-3">
                        <p className="font-medium text-gray-700 text-sm mb-2">Contact Information</p>
                        <div className="flex items-center space-x-2">
                          <MailIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-gray-700 text-sm">
                              {customer.email || "N/A"}
                            </p>
                            {customer.emailVerified !== undefined && (
                              <Badge variant={customer.emailVerified ? "default" : "secondary"} className="text-xs">
                                {customer.emailVerified ? "Verified" : "Unverified"}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <PhoneIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <p className="text-gray-700 text-sm">{customer.phone || "N/A"}</p>
                        </div>

                        {customer.streetAddress && (
                          <div className="flex items-center space-x-2">
                            <HomeIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <p className="text-gray-700 text-sm">
                              {customer.streetAddress}
                            </p>
                          </div>
                        )}
                        {customer.city && (
                          <p className="text-gray-700 text-sm">
                            {customer.city}, {customer.state || ""}, {customer.country || ""}
                          </p>
                        )}
                        {customer.zoneSubCity && (
                          <p className="text-gray-700 text-sm">
                            Zone/Sub City: {customer.zoneSubCity}
                          </p>
                        )}
                        {customer.houseNo && (
                          <p className="text-gray-700 text-sm">
                            House No: {customer.houseNo}
                          </p>
                        )}
                        {(customer.postCode || customer.zipCode) && (
                          <p className="text-gray-700 text-sm">
                            Postal Code: {customer.postCode || customer.zipCode}
                          </p>
                        )}
                      </div>

                      {/* Employment & Financial Information */}
                      <div className="space-y-3">
                        <p className="font-medium text-gray-700 text-sm mb-2">Employment & Financial</p>
                        {customer.occupation && (
                          <div className="flex items-center space-x-2">
                            <BriefcaseIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <p className="text-gray-700 text-sm">
                              Occupation: {customer.occupation}
                            </p>
                          </div>
                        )}
                        {customer.employerName && (
                          <p className="text-gray-700 text-sm">
                            Employer: {customer.employerName}
                          </p>
                        )}
                        {customer.industry && (
                          <p className="text-gray-700 text-sm">
                            Industry: {customer.industry}
                          </p>
                        )}
                        {customer.sector && (
                          <p className="text-gray-700 text-sm">
                            Sector: {customer.sector}
                          </p>
                        )}
                        {customer.salary !== undefined && customer.salary > 0 && (
                          <p className="text-gray-700 text-sm">
                            Salary: {account?.currency || "ETB"} {Number(customer.salary).toFixed(2)}
                          </p>
                        )}
                        {customer.monthlyIncome !== undefined && customer.monthlyIncome > 0 && (
                          <p className="text-gray-700 text-sm">
                            Monthly Income: {account?.currency || "ETB"} {Number(customer.monthlyIncome).toFixed(2)}
                          </p>
                        )}
                        {customer.employeeStatus && (
                          <p className="text-gray-700 text-sm">
                            Employee Status: {customer.employeeStatus}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Document Information */}
                    {(customer.documentName || customer.issueAuthority || customer.issueDate || customer.expirayDate) && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="font-medium text-gray-700 text-sm mb-2">Identification Document</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {customer.documentName && (
                            <div>
                              <p className="text-gray-600 text-sm font-medium">Document Type</p>
                              <p className="text-gray-600 text-sm">{customer.documentName}</p>
                            </div>
                          )}
                          {customer.issueAuthority && (
                            <div>
                              <p className="text-gray-600 text-sm font-medium">Issue Authority</p>
                              <p className="text-gray-600 text-sm">{customer.issueAuthority}</p>
                            </div>
                          )}
                          {customer.issueDate && (
                            <div>
                              <p className="text-gray-600 text-sm font-medium">Issue Date</p>
                              <p className="text-gray-600 text-sm">
                                {format(new Date(customer.issueDate), "MM/dd/yyyy")}
                              </p>
                            </div>
                          )}
                          {customer.expirayDate && (
                            <div>
                              <p className="text-gray-600 text-sm font-medium">Expiry Date</p>
                              <p className="text-gray-600 text-sm">
                                {format(new Date(customer.expirayDate), "MM/dd/yyyy")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Photos and Signatures */}
                    {((customer as any).photo || (customer as any).signature || (customer as any).residenceCard || (customer as any).residenceCardBack) && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="font-medium text-gray-700 text-sm mb-2">Documents</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {(customer as any).photo && (
                            <div className="relative group">
                              <p className="text-gray-600 text-sm font-medium mb-2">Photo</p>
                              <div className="relative w-32 h-32">
                                {isPdfFile((customer as any).photo) ? (
                                  <div className="w-full h-full flex flex-col items-center justify-center rounded border bg-gray-100">
                                    <File className="h-8 w-8 text-gray-400 mb-1" />
                                    <p className="text-xs text-gray-600">PDF</p>
                                  </div>
                                ) : (
                                  <img 
                                    src={(customer as any).photo} 
                                    alt="Customer photo" 
                                    className="w-full h-full object-cover rounded border"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded border flex items-center justify-center">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="opacity-100"
                                    onClick={() => {
                                      setZoomedImage((customer as any).photo);
                                      setZoomedImageTitle(`${customer.fullName} - Photo`);
                                      setIsPdf(isPdfFile((customer as any).photo));
                                    }}
                                  >
                                    <ZoomIn className="h-4 w-4 mr-2" />
                                    {isPdfFile((customer as any).photo) ? 'View' : 'Zoom'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                          {(customer as any).signature && (
                            <div className="relative group">
                              <p className="text-gray-600 text-sm font-medium mb-2">Signature</p>
                              <div className="relative w-32 h-32">
                                {isPdfFile((customer as any).signature) ? (
                                  <div className="w-full h-full flex flex-col items-center justify-center rounded border bg-gray-100">
                                    <File className="h-8 w-8 text-gray-400 mb-1" />
                                    <p className="text-xs text-gray-600">PDF</p>
                                  </div>
                                ) : (
                                  <img 
                                    src={(customer as any).signature} 
                                    alt="Customer signature" 
                                    className="w-full h-full object-contain rounded border bg-white"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded border flex items-center justify-center">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="opacity-100"
                                    onClick={() => {
                                      setZoomedImage((customer as any).signature);
                                      setZoomedImageTitle(`${customer.fullName} - Signature`);
                                      setIsPdf(isPdfFile((customer as any).signature));
                                    }}
                                  >
                                    <ZoomIn className="h-4 w-4 mr-2" />
                                    {isPdfFile((customer as any).signature) ? 'View' : 'Zoom'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                          {(customer as any).residenceCard && (
                            <div className="relative group">
                              <p className="text-gray-600 text-sm font-medium mb-2">Residence Card (Front)</p>
                              <div className="relative w-32 h-32">
                                {isPdfFile((customer as any).residenceCard) ? (
                                  <div className="w-full h-full flex flex-col items-center justify-center rounded border bg-gray-100">
                                    <File className="h-8 w-8 text-gray-400 mb-1" />
                                    <p className="text-xs text-gray-600">PDF</p>
                                  </div>
                                ) : (
                                  <img 
                                    src={(customer as any).residenceCard} 
                                    alt="Residence card front" 
                                    className="w-full h-full object-cover rounded border"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded border flex items-center justify-center">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="opacity-100"
                                    onClick={() => {
                                      setZoomedImage((customer as any).residenceCard);
                                      setZoomedImageTitle(`${customer.fullName} - Residence Card (Front)`);
                                      setIsPdf(isPdfFile((customer as any).residenceCard));
                                    }}
                                  >
                                    <ZoomIn className="h-4 w-4 mr-2" />
                                    {isPdfFile((customer as any).residenceCard) ? 'View' : 'Zoom'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                          {(customer as any).residenceCardBack && (
                            <div className="relative group">
                              <p className="text-gray-600 text-sm font-medium mb-2">Residence Card (Back)</p>
                              <div className="relative w-32 h-32">
                                {isPdfFile((customer as any).residenceCardBack) ? (
                                  <div className="w-full h-full flex flex-col items-center justify-center rounded border bg-gray-100">
                                    <File className="h-8 w-8 text-gray-400 mb-1" />
                                    <p className="text-xs text-gray-600">PDF</p>
                                  </div>
                                ) : (
                                  <img 
                                    src={(customer as any).residenceCardBack} 
                                    alt="Residence card back" 
                                    className="w-full h-full object-cover rounded border"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded border flex items-center justify-center">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="opacity-100"
                                    onClick={() => {
                                      setZoomedImage((customer as any).residenceCardBack);
                                      setZoomedImageTitle(`${customer.fullName} - Residence Card (Back)`);
                                      setIsPdf(isPdfFile((customer as any).residenceCardBack));
                                    }}
                                  >
                                    <ZoomIn className="h-4 w-4 mr-2" />
                                    {isPdfFile((customer as any).residenceCardBack) ? 'View' : 'Zoom'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Timestamps */}
                    {(customer.createdAt || customer.updatedAt) && (
                      <div className="pt-3 border-t text-xs text-gray-500 flex gap-4">
                        {customer.createdAt && (
                          <p>Created: {format(new Date(customer.createdAt), "MM/dd/yyyy")}</p>
                        )}
                        {customer.updatedAt && (
                          <p>Updated: {format(new Date(customer.updatedAt), "MM/dd/yyyy")}</p>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        )}

        {/* Image/PDF Zoom Dialog */}
        <Dialog open={!!zoomedImage} onOpenChange={(open) => {
          if (!open) {
            setZoomedImage(null);
            setIsPdf(false);
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{zoomedImageTitle}</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center p-4">
              {zoomedImage && (
                <>
                  {isPdf ? (
                    <iframe
                      src={zoomedImage}
                      className="w-full h-[70vh] rounded border"
                      title={zoomedImageTitle}
                    />
                  ) : (
                    <img 
                      src={zoomedImage} 
                      alt={zoomedImageTitle}
                      className="max-w-full max-h-[70vh] object-contain rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

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
                onClick={() => handleButtonClick("reject", confirmRejection)}
                disabled={!rejectionReason.trim() || loadingStates.reject}
              >
                {loadingStates.reject ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
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
              onClick={() => navigate('/accounts')}
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

export default JointAccountDetailPresentation;
