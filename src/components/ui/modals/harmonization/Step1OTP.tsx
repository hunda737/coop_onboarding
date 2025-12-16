import { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Loader2, Phone } from "lucide-react";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/features/harmonization/harmonizationApiSlice";
import { useHarmonizationModal } from "@/hooks/use-harmonization-modal";
import { format } from "date-fns";

interface Step1OTPProps {
  onNext?: () => void;
}

export const Step1OTP: FC<Step1OTPProps> = () => {
  const harmonizationModal = useHarmonizationModal();

  // Initialize account number from stored data or empty
  const storedData = harmonizationModal.harmonizationData;
  const hasVerifiedData = storedData?.accountData?.accountData;
  
  const [accountNumber, setAccountNumber] = useState(
    storedData?.accountNumber || storedData?.accountData?.accountNumber || ""
  );
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(!!storedData?.maskedPhoneNumber && !hasVerifiedData);

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  // Update account number when stored data changes
  useEffect(() => {
    if (storedData?.accountNumber && !accountNumber) {
      setAccountNumber(storedData.accountNumber);
    }
  }, [storedData]);

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
      
      harmonizationModal.setHarmonizationData({
        accountNumber: trimmedAccount,
        harmonizationRequestId: response.harmonizationRequestId,
        phoneNumber: response.phoneNumber,
        maskedPhoneNumber: response.maskedPhoneNumber,
      });

      setOtpSent(true);
      toast.success(response.message || "OTP sent successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) {
      toast.error("Please enter the OTP code");
      return;
    }

    if (otpCode.length !== 6) {
      toast.error("OTP code must be 6 digits");
      return;
    }

    const harmonizationData = harmonizationModal.harmonizationData;
    if (!harmonizationData?.harmonizationRequestId) {
      toast.error("Missing harmonization request ID");
      return;
    }

    try {
      const response = await verifyOtp({
        accountNumber,
        harmonizationRequestId: harmonizationData.harmonizationRequestId,
        otpCode,
      }).unwrap();

      if (response.success) {
        harmonizationModal.setHarmonizationData({
          harmonizationRequestId: response.harmonizationRequestId,
          accountData: response.harmonizationData,
        });
        toast.success(response.message || "OTP verified successfully");
        // Don't auto-advance, let user see the data first
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to verify OTP");
    }
  };

  const accountData = storedData?.accountData?.accountData;

  // Show verified account data
  // if (hasVerifiedData && accountData) {
  //   return (
  //     <div className="space-y-6">
  //       <div className="text-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6 rounded-2xl border-2 border-green-300 shadow-lg">
  //         <div className="inline-block p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-3 shadow-md">
  //           <CheckCircle2 className="h-7 w-7 text-white" />
  //         </div>
  //         <h3 className="text-xl font-bold text-green-700 mb-1">OTP Verified Successfully!</h3>
  //         <p className="text-sm text-gray-600">Account information retrieved</p>
  //       </div>

  //       <div 
  //         className="rounded-2xl p-8 shadow-xl border-2" 
  //         style={{ 
  //           borderColor: "#0db0f1",
  //           background: "linear-gradient(135deg, rgba(13, 176, 241, 0.03) 0%, rgba(13, 176, 241, 0.08) 100%)"
  //         }}
  //       >
  //         <div className="space-y-5">
  //           <div className="flex items-center pb-4 border-b-2" style={{ borderColor: "#0db0f1" }}>
  //             <div className="flex-1">
  //               <p className="text-xs font-bold tracking-wider mb-2" style={{ color: "#0db0f1" }}>
  //                 FULL NAME
  //               </p>
  //               <p className="text-lg font-bold text-gray-900">{accountData.accountTitle}</p>
  //             </div>
  //             <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(13, 176, 241, 0.1)" }}>
  //               <User className="h-6 w-6" style={{ color: "#0db0f1" }} />
  //             </div>
  //           </div>

  //           <div className="flex items-center pb-4 border-b-2" style={{ borderColor: "#0db0f1" }}>
  //             <div className="flex-1">
  //               <p className="text-xs font-bold tracking-wider mb-2" style={{ color: "#0db0f1" }}>
  //                 ACCOUNT NUMBER
  //               </p>
  //               <p className="text-lg font-bold text-gray-900">{storedData?.accountData?.accountNumber || accountNumber}</p>
  //             </div>
  //             <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(13, 176, 241, 0.1)" }}>
  //               <Building className="h-6 w-6" style={{ color: "#0db0f1" }} />
  //             </div>
  //           </div>

  //           <div className="flex items-center pb-4 border-b-2" style={{ borderColor: "#0db0f1" }}>
  //             <div className="flex-1">
  //               <p className="text-xs font-bold tracking-wider mb-2" style={{ color: "#0db0f1" }}>
  //                 PHONE NUMBER
  //               </p>
  //               <p className="text-lg font-bold text-gray-900">{accountData.mobile}</p>
  //             </div>
  //             <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(13, 176, 241, 0.1)" }}>
  //               <Phone className="h-6 w-6" style={{ color: "#0db0f1" }} />
  //             </div>
  //           </div>

  //           <div className="flex items-center pb-4 border-b-2" style={{ borderColor: "#0db0f1" }}>
  //             <div className="flex-1">
  //               <p className="text-xs font-bold tracking-wider mb-2" style={{ color: "#0db0f1" }}>
  //                 GENDER
  //               </p>
  //               <p className="text-lg font-bold text-gray-900 capitalize">{accountData.gender.toLowerCase()}</p>
  //             </div>
  //             <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(13, 176, 241, 0.1)" }}>
  //               <User className="h-6 w-6" style={{ color: "#0db0f1" }} />
  //             </div>
  //           </div>

  //           <div className="flex items-center pb-4 border-b-2" style={{ borderColor: "#0db0f1" }}>
  //             <div className="flex-1">
  //               <p className="text-xs font-bold tracking-wider mb-2" style={{ color: "#0db0f1" }}>
  //                 ADDRESS
  //               </p>
  //               <p className="text-lg font-bold text-gray-900">{accountData.address}</p>
  //             </div>
  //             <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(13, 176, 241, 0.1)" }}>
  //               <MapPin className="h-6 w-6" style={{ color: "#0db0f1" }} />
  //             </div>
  //           </div>

  //           <div className="flex items-center pb-4 border-b-2" style={{ borderColor: "#0db0f1" }}>
  //             <div className="flex-1">
  //               <p className="text-xs font-bold tracking-wider mb-2" style={{ color: "#0db0f1" }}>
  //                 ETHNICITY
  //               </p>
  //               <p className="text-lg font-bold text-gray-900">{accountData.ethnicity}</p>
  //             </div>
  //             <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(13, 176, 241, 0.1)" }}>
  //               <User className="h-6 w-6" style={{ color: "#0db0f1" }} />
  //             </div>
  //           </div>

  //           <div className="flex items-center pb-4 border-b-2" style={{ borderColor: "#0db0f1" }}>
  //             <div className="flex-1">
  //               <p className="text-xs font-bold tracking-wider mb-2" style={{ color: "#0db0f1" }}>
  //                 DATE OF BIRTH
  //               </p>
  //               <p className="text-lg font-bold text-gray-900">
  //                 {accountData.dateOfBirth ? format(new Date(accountData.dateOfBirth), "MMMM dd, yyyy") : "N/A"}
  //               </p>
  //             </div>
  //             <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(13, 176, 241, 0.1)" }}>
  //               <Calendar className="h-6 w-6" style={{ color: "#0db0f1" }} />
  //             </div>
  //           </div>

  //           <div className="flex items-center" style={{ borderColor: "#0db0f1" }}>
  //             <div className="flex-1">
  //               <p className="text-xs font-bold tracking-wider mb-2" style={{ color: "#0db0f1" }}>
  //                 OPENING DATE
  //               </p>
  //               <p className="text-lg font-bold text-gray-900">
  //                 {accountData.openingDate ? format(new Date(accountData.openingDate), "MMMM dd, yyyy") : "N/A"}
  //               </p>
  //             </div>
  //             <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(13, 176, 241, 0.1)" }}>
  //               <Calendar className="h-6 w-6" style={{ color: "#0db0f1" }} />
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

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

if (hasVerifiedData && accountData) {
  return (
    <div className="space-y-4">
      {/* Success Header */}
      <div className="border border-green-300 bg-green-50 rounded-lg px-6 py-4">
        <h3 className="text-lg font-semibold text-green-700">
          OTP Verified Successfully
        </h3>
        <p className="text-sm text-gray-600">
          Account information has been retrieved successfully.
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
      </div>
    </div>
  );
}

  return (
    <div className="space-y-4">
      {/* OTP Verification Description */}
      <div className="border-2 rounded-lg p-4 shadow-sm" style={{ background: "linear-gradient(to right, rgba(13, 176, 241, 0.1), rgba(13, 176, 241, 0.05))", borderColor: "rgba(13, 176, 241, 0.3)" }}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="rounded-full p-1.5" style={{ backgroundColor: "rgba(13, 176, 241, 0.2)" }}>
              <Phone className="h-4 w-4" style={{ color: "#0db0f1" }} />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: "#0db0f1" }}>OTP Verification Required</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              To proceed with account harmonization, we need to verify your account ownership. 
              Enter your 13-digit account number to receive a One-Time Password (OTP) via SMS on 
              the registered phone number. This secure verification ensures that only authorized 
              account holders can initiate the harmonization process.
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
            disabled={otpSent || isSendingOtp}
          />
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Account number must be exactly 13 digits
          </p>
        </div>

        {!otpSent && (
          <Button
            onClick={handleSendOtp}
            disabled={isSendingOtp || !accountNumber.trim()}
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
            {isSendingOtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send OTP
          </Button>
        )}
      </div>

      {otpSent && !hasVerifiedData && (
        <div className="space-y-4 border-t pt-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              OTP sent to:{" "}
              <span className="font-semibold">
                {harmonizationModal.harmonizationData?.maskedPhoneNumber}
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otpCode">OTP Code</Label>
            <Input
              id="otpCode"
              placeholder="Enter 6-digit OTP"
              value={otpCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 6) {
                  setOtpCode(value);
                }
              }}
              maxLength={6}
              disabled={isVerifyingOtp}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOtpSent(false);
                setOtpCode("");
              }}
              disabled={isVerifyingOtp}
              className="flex-1"
            >
              Resend OTP
            </Button>
            <Button
              onClick={handleVerifyOtp}
              disabled={isVerifyingOtp || otpCode.length !== 6}
              className="flex-1 shadow-md"
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
              {isVerifyingOtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify OTP
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

