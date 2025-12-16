import { DataTable } from "@/components/ui/data-table";
import { Harmonization, useSaveFaydaDataMutation } from "@/features/harmonization/harmonizationApiSlice";
import { FC, useState } from "react";
import { harmonizationColumns } from "./components/harmonization/harmonization-columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, X, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Step1OTP } from "@/components/ui/modals/harmonization/Step1OTP";
import { Step2Fayda } from "@/components/ui/modals/harmonization/Step2Fayda";
import { Step3Review } from "@/components/ui/modals/harmonization/Step3Review";
import { useHarmonizationModal } from "@/hooks/use-harmonization-modal";
import { cn } from "@/lib/utils";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import { isRoleAuthorized } from "@/types/authorities";
import { toast } from "react-hot-toast";
import { base64ToBlob } from "@/components/ui/modals/harmonization/utils";

type HarmonizationPresentationProps = {
  harmonizations: Harmonization[];
  isLoading: boolean;
  isError: boolean;
  error?: any;
};

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-[500px] w-full" />
  </div>
);

const ErrorDisplay: FC<{ error?: any }> = ({ error }) => {
  const errorMessage = error?.data?.message || error?.message || "Failed to load harmonizations";
  return (
    <div className="p-4 text-red-600 bg-red-100 rounded-md border border-red-200">
      <p className="font-semibold">Error loading harmonizations</p>
      <p className="text-sm mt-1">{errorMessage}</p>
      {error?.status && <p className="text-xs mt-1">Status: {error.status}</p>}
    </div>
  );
};

const HarmonizationPresentation: FC<HarmonizationPresentationProps> = ({
  harmonizations,
  isLoading,
  isError,
  error,
}) => {
  const [showCreate, setShowCreate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const harmonizationModal = useHarmonizationModal();
  const { data: currentUser } = useGetCurrentUserQuery();
  const isCreatorAuthorized = currentUser ? isRoleAuthorized(currentUser.role, ["ACCOUNT-CREATOR"]) : false;
  const [saveFaydaData] = useSaveFaydaDataMutation();

  const handleNext = () => {
    const currentStep = harmonizationModal.currentStep;
    if (currentStep < 3) {
      harmonizationModal.setStep((currentStep + 1) as 1 | 2 | 3);
    }
  };

  const handleBack = () => {
    const currentStep = harmonizationModal.currentStep;
    if (currentStep > 1) {
      harmonizationModal.setStep((currentStep - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = async () => {
    const { harmonizationData, faydaData } = harmonizationModal;
    
    if (!harmonizationData || !faydaData) {
      toast.error("Missing required data");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert base64 picture to File if present
      let pictureFile: File | undefined;
      if (faydaData.pictureUrl) {
        const file = await base64ToBlob(faydaData.pictureUrl, "profile-picture.jpg");
        if (file) {
          pictureFile = file;
        } else {
          console.warn("Failed to convert picture, continuing without it");
        }
      }

      const harmonizationRequestId = harmonizationData.harmonizationRequestId || harmonizationData.accountData?.id;
      
      if (!harmonizationRequestId) {
        toast.error("Missing harmonization request ID");
        setIsSubmitting(false);
        return;
      }

      const requestData = {
        phoneNumber: faydaData.phoneNumber,
        email: faydaData.email,
        familyName: faydaData.familyName,
        name: faydaData.name,
        givenName: faydaData.givenName,
        sub: faydaData.sub,
        picture: pictureFile,
        birthdate: faydaData.birthdate,
        gender: faydaData.gender,
        addressStreetAddress: faydaData.addressStreetAddress,
        addressLocality: faydaData.addressLocality,
        addressRegion: faydaData.addressRegion,
        addressPostalCode: faydaData.addressPostalCode,
        addressCountry: faydaData.addressCountry,
        harmonizationRequestId,
      };

      const response = await saveFaydaData(requestData).unwrap();

      if (response.success) {
        toast.success("Harmonization completed successfully");
        handleComplete();
      }
    } catch (error: any) {
      console.error("Harmonization error:", error);
      toast.error(error?.data?.message || "Failed to complete harmonization");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    harmonizationModal.reset();
    setShowCreate(false);
  };

  const handleOpenCreate = () => {
    harmonizationModal.reset();
    harmonizationModal.setStep(1);
    setShowCreate(true);
  };

  const handleClose = () => {
    harmonizationModal.reset();
    setShowCreate(false);
  };

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorDisplay error={error} />;

  if (showCreate) {
    const steps = [
      { number: 1, title: "OTP Verification", icon: Circle },
      { number: 2, title: "National ID", icon: Circle },
      { number: 3, title: "Review & Submit", icon: Circle },
    ];

    return (
      <div className="space-y-6">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#0db0f1" }}>Create Harmonization</h1>
            <p className="text-gray-600 mt-1">Complete the 3-step process to harmonize your account with National ID</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-10 w-10 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="flex items-center relative mb-12 px-12">
            {steps.map((step, index) => (
              <div key={step.number} className="flex-1 relative flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center border-3 transition-all duration-300 shadow-lg z-10 relative",
                    harmonizationModal.currentStep > step.number
                      ? "bg-green-500 border-green-500 text-white"
                      : harmonizationModal.currentStep === step.number
                      ? "text-white scale-110"
                      : "bg-white border-gray-300 text-gray-400"
                  )}
                  style={
                    harmonizationModal.currentStep === step.number
                      ? { backgroundColor: "#0db0f1", borderColor: "#0db0f1", borderWidth: "3px" }
                      : harmonizationModal.currentStep > step.number
                      ? { borderWidth: "3px" }
                      : { borderWidth: "3px" }
                  }
                >
                  {harmonizationModal.currentStep > step.number ? (
                    <CheckCircle2 className="h-7 w-7" />
                  ) : (
                    <span className="font-bold text-xl">{step.number}</span>
                  )}
                </div>

                {/* Step Title */}
                <p
                  className={cn(
                    "text-sm mt-3 text-center font-semibold",
                    harmonizationModal.currentStep >= step.number
                      ? "text-gray-900"
                      : "text-gray-400"
                  )}
                >
                  {step.title}
                </p>

                {/* Connector Line - positioned to connect circles */}
                {index < steps.length - 1 && (
                  <div
                    className="absolute top-7 left-[50%] h-1 transition-all duration-300 rounded-full"
                    style={{
                      width: "calc(100% - 28px)",
                      backgroundColor: harmonizationModal.currentStep > step.number
                        ? "#0db0f1"
                        : "#e5e7eb",
                      zIndex: 0
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="max-w-3xl mx-auto">
            {harmonizationModal.currentStep === 1 && <Step1OTP />}
            {harmonizationModal.currentStep === 2 && <Step2Fayda />}
            {harmonizationModal.currentStep === 3 && (
              <Step3Review onSubmit={handleSubmit} isSubmitting={isSubmitting} onBack={handleBack} />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2 mt-8 pt-6 border-t justify-end">
            {harmonizationModal.currentStep > 1 && harmonizationModal.currentStep < 3 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="px-4 py-2 text-sm border-gray-300 hover:bg-gray-50 rounded-lg transition-all"
              >
                Previous
              </Button>
            )}

            {harmonizationModal.currentStep < 3 && (
              <Button
                onClick={handleNext}
                disabled={
                  (harmonizationModal.currentStep === 1 && !harmonizationModal.harmonizationData?.accountData?.accountData) ||
                  (harmonizationModal.currentStep === 2 && !harmonizationModal.faydaData)
                }
                className="px-4 py-2 text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
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
                Next
              </Button>
            )}

            {harmonizationModal.currentStep === 3 && (
              <>
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm border-gray-300 hover:bg-gray-50 rounded-lg transition-all"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
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
                  Submit
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#0db0f1" }}>Harmonization</h1>
            <p className="text-gray-600 mt-1">Manage account harmonization with National ID verification</p>
          </div>
          {isCreatorAuthorized && (
            <Button
              onClick={handleOpenCreate}
              className="shadow-lg"
              style={{ backgroundColor: "#0db0f1", borderColor: "#0db0f1" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0ba0d8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#0db0f1";
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Harmonization
            </Button>
          )}
        </div>
      
      <div className="bg-white rounded-xl shadow-sm border">
        {harmonizations.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Harmonizations Found</h3>
            <p className="text-gray-600 mb-4">
              There are no harmonizations yet.
            </p>
            {isCreatorAuthorized && (
              <Button
                onClick={handleOpenCreate}
                className="bg-blue-600 hover:bg-blue-700 shadow-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Harmonization
              </Button>
            )}
          </div>
        ) : (
          <DataTable
            columns={harmonizationColumns}
            data={harmonizations}
            type="harmonization"
            searchKey="accountNumber"
            clickable={true}
            onUrl={false}
          />
        )}
      </div>
    </div>
  );
};

export default HarmonizationPresentation;

