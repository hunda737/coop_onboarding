import { FC, useState } from "react";
import { OrganizationalAccount } from "@/features/accounts/accountApiSlice";
import { format } from "date-fns";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MailIcon,
  PhoneIcon,
  User,
  CalendarIcon,
  BriefcaseIcon,
  DollarSignIcon,
  MapPinIcon,
  LandmarkIcon,
  FileTextIcon,
  X,
  CheckCheck,
  HomeIcon,
  Loader2,
  ZoomIn,
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

type OrganizationalAccountDetailPresentationProps = {
  account: OrganizationalAccount | undefined;
  handleApproveClick: () => void;
  handleRejectClick: (rejectionReason: string) => void;
  handleReverseAuthorization: (accountId: number) => Promise<void>;
  handleUpdateAccountStatus: (status: string) => Promise<void>;
  handleAuthorizeAccount: (accountId: number) => Promise<void>;
  handleVerifyAccount: () => Promise<void>;
  currentUser: CurrentUser | undefined;
};

// Extended interface for customer info that may have additional fields
interface ExtendedCustomerInfo {
  id: number | string;
  fullName: string;
  email: string;
  emailVerified?: boolean;
  phone: string;
  dateOfBirth?: string;
  title?: string;
  issueAuthority?: string;
  issueDate?: string;
  expirayDate?: string;
  haveCboAccount?: boolean;
  percentageComplete?: number;
  createdAt?: string;
  updatedAt?: string;
}

const OrganizationalAccountDetailPresentation: FC<OrganizationalAccountDetailPresentationProps> = ({
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
  const settleModal = useSettleModal();

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
    return <div className="flex w-full justify-center p-6">No Organizational Account found.</div>;
  }

  const confirmRejection = async () => {
    try {
      await handleRejectClick(rejectionReason);
      setIsRejectDialogOpen(false);
      setRejectionReason("");
    } catch (error) {
      // Error handling is done in the container
      // Keep dialog open on error so user can see the error message
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

    // Creator can authorize PENDING accounts (same as Individual)
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

  // Type guard to check if customer has extended fields
  const hasExtendedFields = (customer: any): customer is ExtendedCustomerInfo => {
    return customer && (
      'dateOfBirth' in customer ||
      'title' in customer ||
      'issueAuthority' in customer ||
      'issueDate' in customer ||
      'expirayDate' in customer ||
      'haveCboAccount' in customer
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
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-gray-500" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                {account?.companyName}
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
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {/* Company Information */}
          <div className="space-y-4">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <Building2 className="mr-2 h-5 w-5" />
              Company Information
            </CardTitle>
            <div className="flex items-center space-x-2">
              <FileTextIcon className="h-5 w-5 text-gray-400" />
              <p className="text-gray-700">Name: {account?.companyName || "N/A"}</p>
            </div>
            <div className="flex items-center space-x-2">
              <MailIcon className="h-5 w-5 text-gray-400" />
              <p className="text-gray-700">Email: {account?.companyEmail || "N/A"}</p>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
              <p className="text-gray-700">Phone: {account?.companyPhoneNumber || "N/A"}</p>
            </div>
            <div className="flex items-center space-x-2">
              <LandmarkIcon className="h-5 w-5 text-gray-400" />
              <p className="text-gray-700">TIN: {account?.companyTinNumber || "N/A"}</p>
            </div>
            <div className="flex items-center space-x-2">
              <BriefcaseIcon className="h-5 w-5 text-gray-400" />
              <p className="text-gray-700">Target: {account?.companyTarget || "N/A"}</p>
            </div>
            {(account as any)?.dateOfEstablishment && (
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <p className="text-gray-700">
                  Established: {format(new Date((account as any).dateOfEstablishment), "MM/dd/yyyy")}
                </p>
              </div>
            )}
          </div>

          {/* Company Address */}
          <div className="space-y-4">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <MapPinIcon className="mr-2 h-5 w-5" />
              Company Address
            </CardTitle>
            <div className="flex items-center space-x-2">
              <HomeIcon className="h-5 w-5 text-gray-400" />
              <p className="text-gray-700">
                {account?.companyResidence || "N/A"}
              </p>
            </div>
            <p className="text-gray-700">
              Sub City: {account?.companySubCity || "N/A"}
            </p>
            <p className="text-gray-700">
              Zone: {account?.companyZone || "N/A"}
            </p>
            <p className="text-gray-700">
              State: {account?.companyState || "N/A"}
            </p>
            {account?.companyWoreda && (
              <p className="text-gray-700">
                Woreda: {account.companyWoreda}
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
          </div>
        </CardContent>

        {/* Authorized Representatives Section */}
        {account?.customersInfo && account.customersInfo.length > 0 && (
          <CardContent className="p-6 border-t">
            <CardTitle className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="mr-2 h-5 w-5" />
              Authorized Representatives
            </CardTitle>
            <div className="flex flex-col gap-6 mt-4">
              {account.customersInfo.map((customer, index) => {
                const extendedCustomer = customer as ExtendedCustomerInfo;
                return (
                  <Card key={customer.id || index} className="border rounded-lg p-6 shadow-sm bg-gray-50 w-full">
                    <div className="space-y-4">
                      {/* Name Header */}
                      <div className="flex items-center space-x-2 pb-3 border-b">
                        <User className="h-5 w-5 text-gray-400" />
                        <p className="font-semibold text-gray-800 text-lg">{customer.fullName}</p>
                      </div>
                      
                      {/* Main Content Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        </div>

                        {/* Personal Details */}
                        {hasExtendedFields(extendedCustomer) && (
                          <div className="space-y-3">
                            <p className="font-medium text-gray-700 text-sm mb-2">Personal Details</p>
                            {extendedCustomer.title && (
                              <p className="text-gray-700 text-sm">
                                Title: {extendedCustomer.title}
                              </p>
                            )}
                            
                            {extendedCustomer.dateOfBirth && (
                              <div className="flex items-center space-x-2">
                                <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <p className="text-gray-700 text-sm">
                                  DOB: {format(new Date(extendedCustomer.dateOfBirth), "MM/dd/yyyy")}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Document Information */}
                        {hasExtendedFields(extendedCustomer) && 
                         (extendedCustomer.issueAuthority || extendedCustomer.issueDate || extendedCustomer.expirayDate) && (
                          <div className="space-y-3">
                            <p className="font-medium text-gray-700 text-sm mb-2">Identification Document</p>
                            {extendedCustomer.issueAuthority && (
                              <p className="text-gray-600 text-sm">
                                Authority: {extendedCustomer.issueAuthority}
                              </p>
                            )}
                            {extendedCustomer.issueDate && (
                              <p className="text-gray-600 text-sm">
                                Issue Date: {format(new Date(extendedCustomer.issueDate), "MM/dd/yyyy")}
                              </p>
                            )}
                            {extendedCustomer.expirayDate && (
                              <p className="text-gray-600 text-sm">
                                Expiry Date: {format(new Date(extendedCustomer.expirayDate), "MM/dd/yyyy")}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Photos and Signatures */}
                      {((extendedCustomer as any).photo || (extendedCustomer as any).signature) && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="font-medium text-gray-700 text-sm mb-2">Documents</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(extendedCustomer as any).photo && (
                              <div className="relative group">
                                <p className="text-gray-600 text-sm font-medium mb-2">Photo</p>
                                <div className="relative w-32 h-32">
                                  <img 
                                    src={(extendedCustomer as any).photo} 
                                    alt="Customer photo" 
                                    className="w-full h-full object-cover rounded border"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded border flex items-center justify-center">
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="opacity-100"
                                      onClick={() => {
                                        setZoomedImage((extendedCustomer as any).photo);
                                        setZoomedImageTitle(`${customer.fullName} - Photo`);
                                      }}
                                    >
                                      <ZoomIn className="h-4 w-4 mr-2" />
                                      Zoom
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                            {(extendedCustomer as any).signature && (
                              <div className="relative group">
                                <p className="text-gray-600 text-sm font-medium mb-2">Signature</p>
                                <div className="relative w-32 h-32">
                                  <img 
                                    src={(extendedCustomer as any).signature} 
                                    alt="Customer signature" 
                                    className="w-full h-full object-contain rounded border bg-white"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded border flex items-center justify-center">
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="opacity-100"
                                      onClick={() => {
                                        setZoomedImage((extendedCustomer as any).signature);
                                        setZoomedImageTitle(`${customer.fullName} - Signature`);
                                      }}
                                    >
                                      <ZoomIn className="h-4 w-4 mr-2" />
                                      Zoom
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Timestamps */}
                      {(extendedCustomer.createdAt || extendedCustomer.updatedAt) && (
                        <div className="pt-3 border-t text-xs text-gray-500 flex gap-4">
                          {extendedCustomer.createdAt && (
                            <p>Created: {format(new Date(extendedCustomer.createdAt), "MM/dd/yyyy")}</p>
                          )}
                          {extendedCustomer.updatedAt && (
                            <p>Updated: {format(new Date(extendedCustomer.updatedAt), "MM/dd/yyyy")}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        )}

        {/* Image Zoom Dialog */}
        <Dialog open={!!zoomedImage} onOpenChange={(open) => !open && setZoomedImage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{zoomedImageTitle}</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center p-4">
              {zoomedImage && (
                <img 
                  src={zoomedImage} 
                  alt={zoomedImageTitle}
                  className="max-w-full max-h-[70vh] object-contain rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
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

export default OrganizationalAccountDetailPresentation;
