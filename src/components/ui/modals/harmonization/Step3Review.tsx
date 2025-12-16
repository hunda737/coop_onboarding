import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useHarmonizationModal } from "@/hooks/use-harmonization-modal";
import { format } from "date-fns";

interface Step3ReviewProps {
  onBack?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export const Step3Review: FC<Step3ReviewProps> = ({ onBack, onSubmit: _onSubmit, isSubmitting: _isSubmitting }) => {
  const harmonizationModal = useHarmonizationModal();

  const { harmonizationData, faydaData } = harmonizationModal;
  const accountData = harmonizationData?.accountData?.accountData;

  if (!accountData || !faydaData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Missing required data. Please go back and try again.</p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Review & Harmonization Notice */}
      <div className="border-2 rounded-lg p-4 shadow-sm" style={{ background: "linear-gradient(to right, rgba(13, 176, 241, 0.1), rgba(13, 176, 241, 0.05))", borderColor: "rgba(13, 176, 241, 0.3)" }}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="rounded-full p-1.5" style={{ backgroundColor: "rgba(13, 176, 241, 0.2)" }}>
              <CheckCircle2 className="h-4 w-4" style={{ color: "#0db0f1" }} />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: "#0db0f1" }}>Review & Finalize Harmonization</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Please review all the information displayed below. By clicking "Submit", you confirm 
              that the information is correct and authorize the harmonization of your account with 
              your National ID data. This action will complete the harmonization process.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column - National ID (Fayda Data) */}
        <Card className="border-2 shadow-md" style={{ borderColor: "#0db0f1" }}>
          <CardHeader className="py-3" style={{ background: "linear-gradient(to right, rgba(13, 176, 241, 0.1), rgba(13, 176, 241, 0.15))" }}>
            <CardTitle className="text-sm" style={{ color: "#0db0f1" }}>National ID (Fayda)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-3">
            {faydaData.pictureUrl && (
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <img
                    src={faydaData.pictureUrl}
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-2 object-cover shadow-md"
                    style={{ borderColor: "#0db0f1" }}
                  />
                  <div className="absolute -bottom-1 -right-1 rounded-full p-1 border-2 border-white shadow-sm" style={{ backgroundColor: "#0db0f1" }}>
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
            )}

            <div className="p-2 rounded border" style={{ backgroundColor: "rgba(13, 176, 241, 0.05)", borderColor: "rgba(13, 176, 241, 0.2)" }}>
              <p className="text-[10px] font-semibold mb-0.5" style={{ color: "#0db0f1" }}>Full Name</p>
              <p className="text-sm font-bold text-gray-900">{faydaData.name}</p>
            </div>

            <div className="p-2 rounded border" style={{ backgroundColor: "rgba(13, 176, 241, 0.05)", borderColor: "rgba(13, 176, 241, 0.2)" }}>
              <p className="text-[10px] font-semibold mb-0.5" style={{ color: "#0db0f1" }}>Gender</p>
              <p className="text-sm font-bold text-gray-900">{faydaData.gender}</p>
            </div>

            <div className="p-2 rounded border" style={{ backgroundColor: "rgba(13, 176, 241, 0.05)", borderColor: "rgba(13, 176, 241, 0.2)" }}>
              <p className="text-[10px] font-semibold mb-0.5" style={{ color: "#0db0f1" }}>Date of Birth</p>
              <p className="text-sm font-bold text-gray-900">{faydaData.birthdate}</p>
            </div>

            <div className="p-2 rounded border" style={{ backgroundColor: "rgba(13, 176, 241, 0.05)", borderColor: "rgba(13, 176, 241, 0.2)" }}>
              <p className="text-[10px] font-semibold mb-0.5" style={{ color: "#0db0f1" }}>Phone Number</p>
              <p className="text-sm font-bold text-gray-900">{faydaData.phoneNumber}</p>
            </div>

            <div className="p-2 rounded border" style={{ backgroundColor: "rgba(13, 176, 241, 0.05)", borderColor: "rgba(13, 176, 241, 0.2)" }}>
              <p className="text-[10px] font-semibold mb-0.5" style={{ color: "#0db0f1" }}>Region</p>
              <p className="text-sm font-bold text-gray-900">{faydaData.addressRegion}</p>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Bank Account Data */}
        <Card className="border-2 border-indigo-600 shadow-md">
          <CardHeader className="py-3 bg-gradient-to-r from-indigo-50 to-indigo-100">
            <CardTitle className="text-sm text-indigo-900">Bank Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-3">
            <div className="bg-indigo-50 p-2 rounded border border-indigo-100">
              <p className="text-[10px] text-indigo-600 font-semibold mb-0.5">Account Number</p>
              <p className="text-sm font-bold text-gray-900">{harmonizationData?.accountData?.accountNumber || harmonizationData?.accountNumber}</p>
            </div>

            <div className="bg-indigo-50 p-2 rounded border border-indigo-100">
              <p className="text-[10px] text-indigo-600 font-semibold mb-0.5">Account Title</p>
              <p className="text-sm font-bold text-gray-900">{accountData?.accountTitle}</p>
            </div>

            <div className="bg-indigo-50 p-2 rounded border border-indigo-100">
              <p className="text-[10px] text-indigo-600 font-semibold mb-0.5">Phone Number</p>
              <p className="text-sm font-bold text-gray-900">{accountData?.mobile || harmonizationData?.phoneNumber}</p>
            </div>

            <div className="bg-indigo-50 p-2 rounded border border-indigo-100">
              <p className="text-[10px] text-indigo-600 font-semibold mb-0.5">Address</p>
              <p className="text-sm font-bold text-gray-900">{accountData?.address || "N/A"}</p>
            </div>

            <div className="bg-indigo-50 p-2 rounded border border-indigo-100">
              <p className="text-[10px] text-indigo-600 font-semibold mb-0.5">Gender</p>
              <p className="text-sm font-bold text-gray-900 capitalize">{accountData?.gender?.toLowerCase() || "N/A"}</p>
            </div>

            <div className="bg-indigo-50 p-2 rounded border border-indigo-100">
              <p className="text-[10px] text-indigo-600 font-semibold mb-0.5">Date of Birth</p>
              <p className="text-sm font-bold text-gray-900">
                {accountData?.dateOfBirth ? format(new Date(accountData.dateOfBirth), "MMM dd, yyyy") : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

