import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useSaveFaydaDataMutation } from "@/features/harmonization/harmonizationApiSlice";
import { useHarmonizationModal } from "@/hooks/use-harmonization-modal";
import { base64ToBlob } from "./utils";
import { format } from "date-fns";

interface Step3ReviewProps {
  onBack?: () => void;
  onComplete: () => void;
}

export const Step3Review: FC<Step3ReviewProps> = ({ onBack, onComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const harmonizationModal = useHarmonizationModal();
  const [saveFaydaData] = useSaveFaydaDataMutation();

  const { harmonizationData, faydaData } = harmonizationModal;
  const accountData = harmonizationData?.accountData?.accountData;

  const handleHarmonize = async () => {
    if (!harmonizationData || !faydaData) {
      toast.error("Missing required data");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert base64 picture to File/Blob if present
      let pictureFile: Blob | undefined;
      if (faydaData.picture) {
        const blob = base64ToBlob(faydaData.picture);
        if (blob) {
          pictureFile = blob;
        } else {
          console.warn("Failed to convert picture, continuing without it");
        }
      }

      const requestData = {
        phoneNumber: faydaData.phone_number,
        email: faydaData.email,
        familyName: faydaData.family_name,
        name: faydaData.name,
        givenName: faydaData.given_name,
        sub: faydaData.sub,
        picture: pictureFile,
        birthdate: faydaData.birthdate,
        gender: faydaData.gender,
        addressStreetAddress: faydaData.address.street_address,
        addressLocality: faydaData.address.locality,
        addressRegion: faydaData.address.region,
        addressPostalCode: faydaData.address.postal_code,
        addressCountry: faydaData.address.country,
        harmonizationRequestId: harmonizationData.harmonizationRequestId,
      };

      const response = await saveFaydaData(requestData).unwrap();

      if (response.success) {
        toast.success("Harmonization completed successfully");
        onComplete();
      }
    } catch (error: any) {
      console.error("Harmonization error:", error);
      toast.error(error?.data?.message || "Failed to complete harmonization");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="space-y-6">
      <div className="text-center p-6 rounded-xl border" style={{ background: "linear-gradient(to right, rgba(13, 176, 241, 0.1), rgba(13, 176, 241, 0.05))", borderColor: "rgba(13, 176, 241, 0.3)" }}>
        <h2 className="text-3xl font-bold" style={{ color: "#0db0f1" }}>Review & Harmonize</h2>
        <p className="text-gray-600 mt-2">
          Please review the information before completing the harmonization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - National ID (Fayda Data) */}
        <Card className="border-2 shadow-lg" style={{ borderColor: "#0db0f1" }}>
          <CardHeader style={{ background: "linear-gradient(to right, rgba(13, 176, 241, 0.1), rgba(13, 176, 241, 0.15))" }}>
            <CardTitle className="text-lg" style={{ color: "#0db0f1" }}>National ID (Fayda)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {faydaData.picture && (
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img
                    src={faydaData.picture}
                    alt="Profile"
                    className="w-28 h-28 rounded-full border-4 object-cover shadow-lg"
                    style={{ borderColor: "#0db0f1" }}
                  />
                  <div className="absolute -bottom-2 -right-2 rounded-full p-2 border-4 border-white shadow-md" style={{ backgroundColor: "#0db0f1" }}>
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 rounded-lg border" style={{ backgroundColor: "rgba(13, 176, 241, 0.05)", borderColor: "rgba(13, 176, 241, 0.2)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#0db0f1" }}>Full Name</p>
              <p className="font-bold text-gray-900">{faydaData.name}</p>
            </div>

            <div className="p-3 rounded-lg border" style={{ backgroundColor: "rgba(13, 176, 241, 0.05)", borderColor: "rgba(13, 176, 241, 0.2)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#0db0f1" }}>Gender</p>
              <p className="font-bold text-gray-900">{faydaData.gender}</p>
            </div>

            <div className="p-3 rounded-lg border" style={{ backgroundColor: "rgba(13, 176, 241, 0.05)", borderColor: "rgba(13, 176, 241, 0.2)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#0db0f1" }}>Date of Birth</p>
              <p className="font-bold text-gray-900">{faydaData.birthdate}</p>
            </div>

            <div className="p-3 rounded-lg border" style={{ backgroundColor: "rgba(13, 176, 241, 0.05)", borderColor: "rgba(13, 176, 241, 0.2)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#0db0f1" }}>Phone Number</p>
              <p className="font-bold text-gray-900">{faydaData.phone_number}</p>
            </div>

            <div className="p-3 rounded-lg border" style={{ backgroundColor: "rgba(13, 176, 241, 0.05)", borderColor: "rgba(13, 176, 241, 0.2)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#0db0f1" }}>Region</p>
              <p className="font-bold text-gray-900">{faydaData.address.region}</p>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Bank Account Data */}
        <Card className="border-2 border-indigo-600 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100">
            <CardTitle className="text-lg text-indigo-900">Bank Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-600 font-semibold mb-1">Account Number</p>
              <p className="font-bold text-gray-900">{harmonizationData?.accountData?.accountNumber || harmonizationData?.accountNumber}</p>
            </div>

            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-600 font-semibold mb-1">Account Title</p>
              <p className="font-bold text-gray-900">{accountData?.accountTitle}</p>
            </div>

            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-600 font-semibold mb-1">Phone Number</p>
              <p className="font-bold text-gray-900">{accountData?.mobile || harmonizationData?.phoneNumber}</p>
            </div>

            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-600 font-semibold mb-1">Address</p>
              <p className="font-bold text-gray-900">{accountData?.address || "N/A"}</p>
            </div>

            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-600 font-semibold mb-1">Gender</p>
              <p className="font-bold text-gray-900 capitalize">{accountData?.gender?.toLowerCase() || "N/A"}</p>
            </div>

            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-600 font-semibold mb-1">Date of Birth</p>
              <p className="font-bold text-gray-900">
                {accountData?.dateOfBirth ? format(new Date(accountData.dateOfBirth), "MMM dd, yyyy") : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border-2 rounded-xl p-5 shadow-sm" style={{ background: "linear-gradient(to right, rgba(13, 176, 241, 0.1), rgba(13, 176, 241, 0.05))", borderColor: "rgba(13, 176, 241, 0.3)" }}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="rounded-full p-2" style={{ backgroundColor: "rgba(13, 176, 241, 0.2)" }}>
              <CheckCircle2 className="h-5 w-5" style={{ color: "#0db0f1" }} />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: "#0db0f1" }}>Important Notice</p>
            <p className="text-sm text-gray-700">
              By clicking "Harmonize", you confirm that the information above is correct and authorize 
              the harmonization of your account with your National ID data.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          onClick={handleHarmonize}
          disabled={isSubmitting}
          className="w-full shadow-lg"
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
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Harmonize
        </Button>
      </div>
    </div>
  );
};

