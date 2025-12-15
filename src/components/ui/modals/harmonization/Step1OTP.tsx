import { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Loader2, CheckCircle2, User, Phone, Calendar, MapPin, Building } from "lucide-react";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/features/harmonization/harmonizationApiSlice";
import { useHarmonizationModal } from "@/hooks/use-harmonization-modal";
import { format } from "date-fns";

interface Step1OTPProps {
  onNext?: () => void;
}

export const Step1OTP: FC<Step1OTPProps> = ({ onNext }) => {
  const harmonizationModal = useHarmonizationModal();
  
  // Use onNext from props or from modal
  const handleStepComplete = () => {
    if (onNext) {
      onNext();
    } else {
      harmonizationModal.setStep(2);
    }
  };

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
  if (hasVerifiedData && accountData) {
    return (
      <div className="space-y-6">
        <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
          <div className="inline-block p-2 bg-green-100 rounded-full mb-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-green-700">OTP Verified Successfully!</h3>
          <p className="text-sm text-gray-600 mt-1">Account information retrieved</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-md hover:shadow-lg transition-shadow" style={{ borderColor: "#0db0f1", borderWidth: "1px" }}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "#0db0f1", opacity: 0.1 }}>
                  <User className="h-5 w-5" style={{ color: "#0db0f1" }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold mb-1" style={{ color: "#0db0f1" }}>Full Name</p>
                  <p className="font-bold text-gray-900">{accountData.accountTitle}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow" style={{ borderColor: "#0db0f1", borderWidth: "1px" }}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "#0db0f1", opacity: 0.1 }}>
                  <Building className="h-5 w-5" style={{ color: "#0db0f1" }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold mb-1" style={{ color: "#0db0f1" }}>Account Number</p>
                  <p className="font-bold text-gray-900">{storedData?.accountData?.accountNumber || accountNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow" style={{ borderColor: "#0db0f1", borderWidth: "1px" }}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "#0db0f1", opacity: 0.1 }}>
                  <Phone className="h-5 w-5" style={{ color: "#0db0f1" }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold mb-1" style={{ color: "#0db0f1" }}>Phone Number</p>
                  <p className="font-bold text-gray-900">{accountData.mobile}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow" style={{ borderColor: "#0db0f1", borderWidth: "1px" }}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "#0db0f1", opacity: 0.1 }}>
                  <User className="h-5 w-5" style={{ color: "#0db0f1" }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold mb-1" style={{ color: "#0db0f1" }}>Gender</p>
                  <p className="font-bold text-gray-900 capitalize">{accountData.gender.toLowerCase()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow col-span-2" style={{ borderColor: "#0db0f1", borderWidth: "1px" }}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "#0db0f1", opacity: 0.1 }}>
                  <MapPin className="h-5 w-5" style={{ color: "#0db0f1" }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold mb-1" style={{ color: "#0db0f1" }}>Address</p>
                  <p className="font-bold text-gray-900">{accountData.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow" style={{ borderColor: "#0db0f1", borderWidth: "1px" }}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "#0db0f1", opacity: 0.1 }}>
                  <Calendar className="h-5 w-5" style={{ color: "#0db0f1" }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold mb-1" style={{ color: "#0db0f1" }}>Date of Birth</p>
                  <p className="font-bold text-gray-900">
                    {accountData.dateOfBirth ? format(new Date(accountData.dateOfBirth), "MMM dd, yyyy") : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow" style={{ borderColor: "#0db0f1", borderWidth: "1px" }}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "#0db0f1", opacity: 0.1 }}>
                  <Calendar className="h-5 w-5" style={{ color: "#0db0f1" }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold mb-1" style={{ color: "#0db0f1" }}>Opening Date</p>
                  <p className="font-bold text-gray-900">
                    {accountData.openingDate ? format(new Date(accountData.openingDate), "MMM dd, yyyy") : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

