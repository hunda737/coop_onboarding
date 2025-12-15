import { FC, useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { isRoleAuthorized } from "@/types/authorities";
import { User } from "@/features/user/userApiSlice";
import { HarmonizationDetail } from "@/features/harmonization/harmonizationApiSlice";
import { GitMerge, X, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

type HarmonizationDetailPresentationProps = {
  harmonization: HarmonizationDetail | undefined;
  isLoading: boolean;
  handleMerge: () => Promise<void>;
  handleReject: (rejectionReason: string) => Promise<void>;
  currentUser: User | undefined;
};

// Helper function to compare values
const valuesMatch = (value1: string | undefined, value2: string | undefined): boolean => {
  if (!value1 && !value2) return true;
  if (!value1 || !value2) return false;
  return value1.trim().toLowerCase() === value2.trim().toLowerCase();
};

// Helper function to format date
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), "MM/dd/yyyy");
  } catch {
    return dateString;
  }
};

// Helper function to normalize gender
const normalizeGender = (gender: string | undefined): string => {
  if (!gender) return "N/A";
  const normalized = gender.toLowerCase();
  if (normalized === "male" || normalized === "m") return "MALE";
  if (normalized === "female" || normalized === "f") return "FEMALE";
  return gender.toUpperCase();
};

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-[500px] w-full" />
  </div>
);

const HarmonizationDetailPresentation: FC<HarmonizationDetailPresentationProps> = ({
  harmonization,
  isLoading,
  handleMerge,
  handleReject,
  currentUser,
}) => {
  const navigate = useNavigate();
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isMerging, setIsMerging] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  if (isLoading) return <LoadingSkeleton />;

  if (!harmonization) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md border border-red-200">
        <p className="font-semibold">Harmonization not found</p>
      </div>
    );
  }

  const accountData = harmonization.accountData;
  const faydaData = harmonization.faydaData;

  // Check if user is account-approver
  const isApproverAuthorized = currentUser && isRoleAuthorized(currentUser.role, [
    "ACCOUNT-APPROVER",
  ]);

  const confirmRejection = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setIsRejecting(true);
    try {
      await handleReject(rejectionReason);
      setIsRejectDialogOpen(false);
      setRejectionReason("");
    } catch (error) {
      // Error handling is done in the container
    } finally {
      setIsRejecting(false);
    }
  };

  const handleMergeClick = async () => {
    setIsMerging(true);
    try {
      await handleMerge();
    } catch (error) {
      // Error handling is done in the container
    } finally {
      setIsMerging(false);
    }
  };

  // Compare values for highlighting
  const nameMatches = valuesMatch(accountData?.accountTitle, faydaData?.name);
  const genderMatches = valuesMatch(
    normalizeGender(accountData?.gender),
    normalizeGender(faydaData?.gender)
  );
  const dobMatches = valuesMatch(
    accountData?.dateOfBirth ? format(new Date(accountData.dateOfBirth), "yyyy-MM-dd") : "",
    faydaData?.birthdate ? format(new Date(faydaData.birthdate), "yyyy-MM-dd") : ""
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/harmonization")}
            className="h-10 w-10 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#0db0f1" }}>
              Harmonization Details
            </h1>
            <p className="text-gray-600 mt-1">
              Compare account data with National ID (Fayda) data
            </p>
          </div>
        </div>
        <Badge
          variant={
            harmonization.status === "PENDING_KYC_REVIEW"
              ? "secondary"
              : harmonization.status === "COMPLETED"
              ? "default"
              : "outline"
          }
        >
          {harmonization.status === "PENDING_KYC_REVIEW"
            ? "Pending KYC Review"
            : harmonization.status === "COMPLETED"
            ? "Completed"
            : harmonization.status}
        </Badge>
      </div>

      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Account Number</p>
            <p className="text-gray-700 font-semibold">{harmonization.accountNumber || "N/A"}</p>
          </div>
          {harmonization.addedBy && (
            <>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Added By</p>
                <p className="text-gray-700">{harmonization.addedBy.fullName || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Branch</p>
                <p className="text-gray-700">{harmonization.addedBy.branch || "N/A"}</p>
              </div>
            </>
          )}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Created At</p>
            <p className="text-gray-700">
              {formatDate(harmonization.createdAt)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Review Information Card - Show if review exists */}
      {harmonization.review && (
        <Card>
          <CardHeader>
            <CardTitle>Review Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Decision</p>
              <Badge
                variant={harmonization.review.decision === "REJECT" ? "destructive" : "default"}
                className="mt-1"
              >
                {harmonization.review.decision}
              </Badge>
            </div>
            {harmonization.review.reviewedBy && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Reviewed By</p>
                <p className="text-gray-700">{harmonization.review.reviewedBy.fullName || "N/A"}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Reviewed At</p>
              <p className="text-gray-700">
                {formatDate(harmonization.review.reviewedAt)}
              </p>
            </div>
            {harmonization.review.rejectionReason && (
              <div className="md:col-span-2">
                <p className="text-xs font-medium text-gray-500 uppercase mb-2">Rejection Reason</p>
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-gray-700">{harmonization.review.rejectionReason}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Comparison Section */}
      {faydaData && accountData && (
        <Card>
          <CardContent className="border-t bg-blue-50/30 p-6">
            <div className="mb-6">
              <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                Data Comparison
              </CardTitle>
              <p className="text-sm text-gray-600">
                Compare the National ID (Fayda) data with the existing account data
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fayda Data - Left Side */}
              <div className="space-y-4 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between pb-3 border-b">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    National ID (Fayda) Data
                  </CardTitle>
                  <Badge variant="outline" className="bg-blue-50">NEW</Badge>
                </div>

                {/* Personal Information */}
                <div className="space-y-3">
                  <CardTitle className="text-base font-semibold text-gray-700">
                    Personal Information
                  </CardTitle>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Full Name</p>
                    <p
                      className={`text-gray-700 ${
                        !nameMatches ? "font-semibold text-orange-600" : ""
                      }`}
                    >
                      {faydaData.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Gender</p>
                    <p
                      className={`text-gray-700 ${
                        !genderMatches ? "font-semibold text-orange-600" : ""
                      }`}
                    >
                      {faydaData.gender || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Date of Birth</p>
                    <p
                      className={`text-gray-700 ${
                        !dobMatches ? "font-semibold text-orange-600" : ""
                      }`}
                    >
                      {formatDate(faydaData.birthdate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Address</p>
                    <p className="text-gray-700">
                      {[
                        faydaData.addressStreetAddress,
                        faydaData.addressLocality,
                        faydaData.addressRegion,
                        faydaData.addressPostalCode,
                        faydaData.addressCountry,
                      ]
                        .filter(Boolean)
                        .join(", ") || "N/A"}
                    </p>
                  </div>
                  {faydaData.phoneNumber && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Phone Number</p>
                      <p className="text-gray-700">{faydaData.phoneNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Data - Right Side */}
              <div className="space-y-4 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between pb-3 border-b">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    Account Data
                  </CardTitle>
                  <Badge variant="outline" className="bg-green-50">EXISTING</Badge>
                </div>

                {/* Personal Information */}
                <div className="space-y-3">
                  <CardTitle className="text-base font-semibold text-gray-700">
                    Personal Information
                  </CardTitle>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Full Name</p>
                    <p
                      className={`text-gray-700 ${
                        !nameMatches ? "font-semibold text-orange-600" : ""
                      }`}
                    >
                      {accountData.accountTitle || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Gender</p>
                    <p
                      className={`text-gray-700 ${
                        !genderMatches ? "font-semibold text-orange-600" : ""
                      }`}
                    >
                      {accountData.gender || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Date of Birth</p>
                    <p
                      className={`text-gray-700 ${
                        !dobMatches ? "font-semibold text-orange-600" : ""
                      }`}
                    >
                      {formatDate(accountData.dateOfBirth)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Address</p>
                    <p className="text-gray-700">{accountData.address || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Phone Number</p>
                    <p className="text-gray-700">{accountData.mobile || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Only for ACCOUNT-APPROVER */}
            {isApproverAuthorized && harmonization.status === "PENDING_KYC_REVIEW" && (
              <div className="flex flex-col items-center justify-center py-4 space-y-3 mt-6">
                <p className="text-sm text-gray-600 text-center max-w-md">
                  Review the data comparison above. You can merge the National ID data with the
                  account data or reject the harmonization request.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsRejectDialogOpen(true)}
                    disabled={isRejecting || isMerging}
                  >
                    {isRejecting ? (
                      <>
                        <X className="mr-2 h-4 w-4 animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </>
                    )}
                  </Button>
                  <Button
                    className="border bg-cyan-500 hover:bg-cyan-600"
                    size="sm"
                    onClick={handleMergeClick}
                    disabled={isMerging || isRejecting}
                  >
                    {isMerging ? (
                      <>
                        <GitMerge className="mr-2 h-4 w-4 animate-spin" />
                        Merging...
                      </>
                    ) : (
                      <>
                        <GitMerge className="mr-2 h-4 w-4" />
                        Merge
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Harmonization</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this harmonization request.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectDialogOpen(false);
                setRejectionReason("");
              }}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRejection} disabled={isRejecting}>
              {isRejecting ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HarmonizationDetailPresentation;

