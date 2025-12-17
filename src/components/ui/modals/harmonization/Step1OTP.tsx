import { FC, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Loader2, Building } from "lucide-react";
import {
  useSendOtpMutation,
  useGetHarmonizationByIdQuery,
  useLazyGetImageByIdQuery,
} from "@/features/harmonization/harmonizationApiSlice";
import { useHarmonizationModal } from "@/hooks/use-harmonization-modal";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CardTitle } from "@/components/ui/card";

interface Step1OTPProps {
  onNext?: () => void;
}

export const Step1OTP: FC<Step1OTPProps> = () => {
  const harmonizationModal = useHarmonizationModal();

  // Initialize account number from stored data or empty
  const storedData = harmonizationModal.harmonizationData;
  const hasVerifiedData = !!storedData?.accountData?.accountData;
  
  const [accountNumber, setAccountNumber] = useState(
    storedData?.accountNumber || storedData?.accountData?.accountNumber || ""
  );

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [harmonizationRequestId, setHarmonizationRequestId] = useState<number | null>(null);
  const processedRequestIdRef = useRef<number | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [zoomedImageTitle, setZoomedImageTitle] = useState<string>("");
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
  const [getImageById] = useLazyGetImageByIdQuery();
  
  // Fetch harmonization detail to get account data
  const { data: harmonizationDetail, isLoading: isLoadingDetail } = useGetHarmonizationByIdQuery(
    harmonizationRequestId!,
    { skip: !harmonizationRequestId }
  );

  // Handle image card click
  const handleImageClick = async (imageId: number, imageType: string) => {
    setIsLoadingImage(true);
    try {
      const blob = await getImageById(imageId).unwrap();
      const imageUrl = URL.createObjectURL(blob);
      setZoomedImage(imageUrl);
      setZoomedImageTitle(`${imageType} - Image #${imageId}`);
    } catch (error) {
      toast.error("Failed to load image");
      console.error("Error loading image:", error);
    } finally {
      setIsLoadingImage(false);
    }
  };

  // Update account number when stored data changes
  useEffect(() => {
    if (storedData?.accountNumber && !accountNumber) {
      setAccountNumber(storedData.accountNumber);
    }
  }, [storedData, accountNumber]);

  // When harmonization detail is loaded, store account data (don't auto-advance)
  useEffect(() => {
    if (harmonizationDetail && harmonizationRequestId && processedRequestIdRef.current !== harmonizationRequestId) {
      harmonizationModal.setHarmonizationData({
        accountNumber: harmonizationDetail.accountNumber,
        harmonizationRequestId: harmonizationDetail.id,
        phoneNumber: harmonizationDetail.phoneNumber,
        accountData: {
          id: harmonizationDetail.id,
          accountNumber: harmonizationDetail.accountNumber,
          phoneNumber: harmonizationDetail.phoneNumber,
          status: harmonizationDetail.status,
          createdAt: harmonizationDetail.createdAt,
          updatedAt: harmonizationDetail.createdAt,
          accountData: harmonizationDetail.accountData,
        },
      });
      processedRequestIdRef.current = harmonizationRequestId;
    }
  }, [harmonizationDetail, harmonizationRequestId]);

  const handleSendOtp = async () => {
    const trimmedAccount = accountNumber.trim();
    
    if (!trimmedAccount) {
      toast.error("Please enter an account number");
      return;
    }

    // Basic validation - account number should be numeric
    if (!/^\d+$/.test(trimmedAccount)) {
      toast.error("Account number must contain only digits");
      return;
    }

    if (trimmedAccount.length !== 13) {
      toast.error("Account number must be exactly 13 digits");
      return;
    }

    try {
      const response = await sendOtp({ accountNumber: trimmedAccount }).unwrap();
      
      // Store basic data and harmonizationRequestId
      harmonizationModal.setHarmonizationData({
        accountNumber: trimmedAccount,
        harmonizationRequestId: response.harmonizationRequestId,
        phoneNumber: response.phoneNumber,
        maskedPhoneNumber: response.maskedPhoneNumber,
      });

      // Set the ID to trigger fetching harmonization detail
      setHarmonizationRequestId(response.harmonizationRequestId);
      processedRequestIdRef.current = null; // Reset ref when starting new request

      // Show success message without mentioning OTP
      const message = response.message || "Account harmonization request created successfully";
      const cleanMessage = message.replace(/OTP.*?skipped/gi, "").replace(/for staff request/gi, "").trim();
      toast.success(cleanMessage || "Account information retrieved successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to retrieve account information");
    }
  };

  const accountData = storedData?.accountData?.accountData;

  type DetailRowProps = {
    label: string;
    value?: string | number | null;
  };

  const DetailRow = ({ label, value }: DetailRowProps) => {
    return (
      <div className="grid grid-cols-3 gap-4 px-6 py-3 text-sm">
        <div className="font-medium text-gray-600">
          {label}
        </div>
        <div className="col-span-2 font-semibold text-gray-900">
          {value || "—"}
        </div>
      </div>
    );
  };

  // Show account information if data is retrieved
  if (hasVerifiedData && accountData) {
    return (
      <div className="space-y-4">
        {/* Success Header */}
        <div className="border border-green-300 bg-green-50 rounded-lg px-6 py-4">
          <h3 className="text-lg font-semibold text-green-700">
            Account Information Retrieved
          </h3>
          <p className="text-sm text-gray-600">
            Account information has been retrieved successfully. Review the details below and continue to the next step.
          </p>
        </div>

        {/* Account Details */}
        <div className="border rounded-lg bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h4 className="text-base font-semibold text-gray-800">
              Customer Account Information
            </h4>
          </div>

          <div className="divide-y">
            <DetailRow label="Full Name" value={accountData.accountTitle} />

            <DetailRow
              label="Account Number"
              value={storedData?.accountData?.accountNumber || accountNumber}
            />

            <DetailRow label="Phone Number" value={accountData.mobile} />

            <DetailRow
              label="Gender"
              value={accountData.gender}
            />

            <DetailRow
              label="Address"
              value={accountData.address}
            />

            <DetailRow
              label="Ethnicity"
              value={accountData.ethnicity}
            />

            <DetailRow
              label="Date of Birth"
              value={
                accountData.dateOfBirth
                  ? format(new Date(accountData.dateOfBirth), "MMMM dd, yyyy")
                  : "N/A"
              }
            />

            <DetailRow
              label="Account Opening Date"
              value={
                accountData.openingDate
                  ? format(new Date(accountData.openingDate), "MMMM dd, yyyy")
                  : "N/A"
              }
            />
          </div>

          {/* Images Section */}
          {harmonizationDetail?.images && harmonizationDetail.images.length > 0 && (
            <div className="space-y-3 px-6 py-4 border-t">
              <CardTitle className="text-base font-semibold text-gray-700">
                Images
              </CardTitle>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                {harmonizationDetail.images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => handleImageClick(image.id, image.imageType)}
                    disabled={isLoadingImage}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
                  >
                    {isLoadingImage ? "Loading..." : image.imageType}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => harmonizationModal.setStep(2)}
            className="px-6 py-2 shadow-md"
            style={{ backgroundColor: "#0db0f1", borderColor: "#0db0f1" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#0ba0d8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0db0f1";
            }}
          >
            Continue to National ID
          </Button>
        </div>

        {/* Image Zoom Dialog */}
        <Dialog open={!!zoomedImage} onOpenChange={(open) => {
          if (!open) {
            if (zoomedImage && zoomedImage.startsWith('blob:')) {
              URL.revokeObjectURL(zoomedImage);
            }
            setZoomedImage(null);
          }
        }}>
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
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Account Information Description */}
      <div className="border-2 rounded-lg p-4 shadow-sm" style={{ background: "linear-gradient(to right, rgba(13, 176, 241, 0.1), rgba(13, 176, 241, 0.05))", borderColor: "rgba(13, 176, 241, 0.3)" }}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="rounded-full p-1.5" style={{ backgroundColor: "rgba(13, 176, 241, 0.2)" }}>
              <Building className="h-4 w-4" style={{ color: "#0db0f1" }} />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: "#0db0f1" }}>Account Verification</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              To proceed with account harmonization, enter your 13-digit account number. 
              The system will automatically retrieve and verify your account information.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input
            id="accountNumber"
            placeholder="Enter 13-digit account number"
            value={accountNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 13) {
                setAccountNumber(value);
              }
            }}
            maxLength={13}
            disabled={hasVerifiedData || isSendingOtp || isLoadingDetail}
          />
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Account number must be exactly 13 digits
          </p>
        </div>

        {!hasVerifiedData && (
          <Button
            onClick={handleSendOtp}
            disabled={isSendingOtp || isLoadingDetail || !accountNumber.trim() || accountNumber.length !== 13}
            className="w-full shadow-md"
            style={{ backgroundColor: "#0db0f1", borderColor: "#0db0f1" }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = "#0ba0d8";
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = "#0db0f1";
              }
            }}
          >
            {(isSendingOtp || isLoadingDetail) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSendingOtp || isLoadingDetail ? "Retrieving Account Information..." : "Retrieve Account Information"}
          </Button>
        )}
      </div>
    </div>
  );
};

