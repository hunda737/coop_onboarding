import { Modal } from "@/components/ui/modal";
import { useHarmonizationModal } from "@/hooks/use-harmonization-modal";
import { Step1OTP } from "./harmonization/Step1OTP";
import { Step2Fayda } from "./harmonization/Step2Fayda";
import { Step3Review } from "./harmonization/Step3Review";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export const HarmonizationModal = () => {
  const harmonizationModal = useHarmonizationModal();

  const handleComplete = () => {
    harmonizationModal.onClose();
  };

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

  const steps = [
    { number: 1, title: "OTP Verification", icon: Circle },
    { number: 2, title: "National ID", icon: Circle },
    { number: 3, title: "Review & Submit", icon: Circle },
  ];

  return (
    <Modal
      title="Create Harmonization"
      description="Complete the 3-step process to harmonize your account with National ID"
      isOpen={harmonizationModal.isOpen}
      onClose={harmonizationModal.onClose}
    >
      <div className="space-y-6">
        {/* Stepper */}
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => (
            <div key={step.number} className="flex-1 relative">
              <div className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                    harmonizationModal.currentStep > step.number
                      ? "bg-green-600 border-green-600 text-white"
                      : harmonizationModal.currentStep === step.number
                      ? "bg-cyan-600 border-cyan-600 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  )}
                >
                  {harmonizationModal.currentStep > step.number ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="font-semibold">{step.number}</span>
                  )}
                </div>

                {/* Step Title */}
                <p
                  className={cn(
                    "text-xs mt-2 text-center font-medium",
                    harmonizationModal.currentStep >= step.number
                      ? "text-gray-900"
                      : "text-gray-400"
                  )}
                >
                  {step.title}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-5 left-[50%] w-full h-0.5 -z-10",
                    harmonizationModal.currentStep > step.number
                      ? "bg-green-600"
                      : "bg-gray-300"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="mt-8">
          {harmonizationModal.currentStep === 1 && <Step1OTP onNext={handleNext} />}
          {harmonizationModal.currentStep === 2 && (
            <Step2Fayda onNext={handleNext} onBack={handleBack} />
          )}
          {harmonizationModal.currentStep === 3 && (
            <Step3Review onSubmit={handleComplete} />
          )}
        </div>
      </div>
    </Modal>
  );
};

