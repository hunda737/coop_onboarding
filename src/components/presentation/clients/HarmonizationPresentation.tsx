import { DataTable } from "@/components/ui/data-table";
import { Harmonization, useSaveFaydaDataMutation, useLazyExportHarmonizationDataQuery } from "@/features/harmonization/harmonizationApiSlice";
import { FC, useState, useMemo } from "react";
import { harmonizationColumns } from "./components/harmonization/harmonization-columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, X, CheckCircle2, Circle, Loader2, Download } from "lucide-react";
import { Step1OTP } from "@/components/ui/modals/harmonization/Step1OTP";
import { Step2Fayda } from "@/components/ui/modals/harmonization/Step2Fayda";
import { Step3Review } from "@/components/ui/modals/harmonization/Step3Review";
import { useHarmonizationModal } from "@/hooks/use-harmonization-modal";
import { cn } from "@/lib/utils";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import { isRoleAuthorized } from "@/types/authorities";
import { toast } from "react-hot-toast";
import { base64ToBlob } from "@/components/ui/modals/harmonization/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Select, { SingleValue } from "react-select";
import { useGetAllBranchesQuery, useGetAllDistrictsQuery } from "@/features/branches/branchApiSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type HarmonizationStatus = "PENDING_KYC" | "MERGED" | "REJECTED";
type FilterType = "SELF_ONBOARD" | "BRANCH";

type HarmonizationPresentationProps = {
  harmonizations: Harmonization[];
  isLoading: boolean;
  isError: boolean;
  error?: any;
  status: HarmonizationStatus;
  onStatusChange: (status: HarmonizationStatus) => void;
  filterType: FilterType;
  onFilterTypeChange: (type: FilterType) => void;
  selectedDistrictId?: number;
  onDistrictIdChange: (districtId: number | undefined) => void;
  selectedBranchId?: number;
  onBranchIdChange: (branchId: number | undefined) => void;
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
  status,
  onStatusChange,
  filterType,
  onFilterTypeChange,
  selectedDistrictId,
  onDistrictIdChange,
  selectedBranchId,
  onBranchIdChange,
}) => {
  const [showCreate, setShowCreate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const harmonizationModal = useHarmonizationModal();
  const { data: currentUser } = useGetCurrentUserQuery();
  const isCreatorAuthorized = currentUser ? isRoleAuthorized(currentUser.role, ["ACCOUNT-CREATOR"]) : false;
  const isFilterAuthorized = currentUser ? isRoleAuthorized(currentUser.role, ["ACCOUNT-APPROVER", "SUPER-ADMIN"]) : false;
  const [saveFaydaData] = useSaveFaydaDataMutation();
  const [exportHarmonizationData] = useLazyExportHarmonizationDataQuery();
  const { data: branches } = useGetAllBranchesQuery();
  const { data: districts } = useGetAllDistrictsQuery();

  // Filter branches by selected district
  const filteredBranches = useMemo(() => {
    if (!branches) return [];
    if (!selectedDistrictId || filterType !== "BRANCH") return branches;
    
    const selectedDistrict = districts?.find(d => d.id === selectedDistrictId);
    if (!selectedDistrict) return branches;
    
    return branches.filter((branch: any) => branch.district === selectedDistrict.name);
  }, [branches, selectedDistrictId, districts, filterType]);

  // Map districts to react-select options
  const districtOptions = districts?.map((district) => ({
    label: district.name,
    value: district.id?.toString() || "",
  })) || [];

  // Map branches to react-select options
  const branchOptions = filteredBranches?.map((branch: any) => ({
    label: branch.companyName || "Unknown Branch",
    value: branch.id?.toString() || "",
  })) || [];

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
      // console.log("pictureFile", pictureFile);

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

  const handleExportClick = () => {
    setShowExportDialog(true);
  };

  const handleExport = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date must be before or equal to end date");
      return;
    }

    setIsExporting(true);
    try {
      const result = await exportHarmonizationData({ startDate, endDate }).unwrap();
      
      // Create a download link
      const url = window.URL.createObjectURL(result);
      const link = document.createElement("a");
      link.href = url;
      link.download = `harmonization-export-${startDate}-to-${endDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Export completed successfully");
      setShowExportDialog(false);
      setStartDate("");
      setEndDate("");
    } catch (error: any) {
      console.error("Export error:", error);
      toast.error(error?.data?.message || "Failed to export harmonization data");
    } finally {
      setIsExporting(false);
    }
  };

  // Only show loading skeleton for initial load when showCreate is true
  if (isLoading && !harmonizations.length && showCreate) return <LoadingSkeleton />;
  if (isError && !showCreate) return <ErrorDisplay error={error} />;

  if (showCreate) {
    const steps = [
      { number: 1, title: "Account Information", icon: Circle },
      { number: 2, title: "National ID", icon: Circle },
      { number: 3, title: "Review & Submit", icon: Circle },
    ];

    return (
      <div className="space-y-6">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#0db0f1" }}>Create Harmonization</h1>
            <p className="text-gray-600 mt-1">Complete the 3-step process to harmonize your account with National ID verification</p>
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

        {/* Stepper - Sticky when scrolling, positioned below top navigation */}
        <div className="sticky top-16 bg-white rounded-xl shadow-sm border p-4 z-40 mb-6 max-w-3xl mx-auto">
          <div className="flex items-center relative mb-4 px-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex-1 relative flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-md z-10 relative",
                    harmonizationModal.currentStep > step.number
                      ? "text-white"
                      : harmonizationModal.currentStep === step.number
                      ? "text-white scale-105"
                      : "bg-white border-gray-300 text-gray-400"
                  )}
                  style={
                    harmonizationModal.currentStep >= step.number
                      ? { backgroundColor: "#0db0f1", borderColor: "#0db0f1", borderWidth: "2px" }
                      : { borderWidth: "2px" }
                  }
                >
                  {harmonizationModal.currentStep > step.number ? (
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  ) : (
                    <span className="font-bold text-base">{step.number}</span>
                  )}
                </div>

                {/* Step Title */}
                <p
                  className={cn(
                    "text-xs mt-2 text-center font-semibold",
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
                    className="absolute top-5 left-[50%] h-0.5 transition-all duration-300 rounded-full"
                    style={{
                      width: "calc(100% - 20px)",
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

        </div>

        {/* Step Content */}
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border p-8">
          {harmonizationModal.currentStep === 1 && <Step1OTP />}
          {harmonizationModal.currentStep === 2 && <Step2Fayda />}
          {harmonizationModal.currentStep === 3 && (
            <Step3Review onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          )}

          {/* Submit Button - Only on Step 3 */}
          {harmonizationModal.currentStep === 3 && (
            <div className="flex gap-2 mt-8 pt-6 border-t justify-end">
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
            </div>
          )}
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
      
      {/* Filter Section - Only for ACCOUNT-APPROVER and SUPER-ADMIN */}
      {isFilterAuthorized && (
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium text-gray-700">Filter by:</Label>
              <RadioGroup
                value={filterType}
                onValueChange={(value) => {
                  onFilterTypeChange(value as FilterType);
                  if (value === "SELF_ONBOARD") {
                    onDistrictIdChange(undefined);
                    onBranchIdChange(undefined);
                  } else if (value === "BRANCH") {
                    // First district will be auto-selected by the container
                    onBranchIdChange(undefined);
                  }
                }}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SELF_ONBOARD" id="self-onboard" />
                  <Label htmlFor="self-onboard" className="font-normal cursor-pointer">
                    Self Onboard
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BRANCH" id="branch" />
                  <Label htmlFor="branch" className="font-normal cursor-pointer">
                    Branch
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {filterType === "BRANCH" && (
              <div className="flex items-center gap-4">
                <div className="flex-1 max-w-xs">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">District</Label>
                  <Select
                    options={districtOptions}
                    isSearchable
                    isClearable
                    placeholder="Select district (optional)"
                    value={districtOptions.find(
                      (option) => option.value === selectedDistrictId?.toString()
                    )}
                    onChange={(option: SingleValue<{ label: string; value: string }>) => {
                      const newDistrictId = option ? parseInt(option.value) : undefined;
                      onDistrictIdChange(newDistrictId);
                      // Clear branch selection when district changes
                      if (selectedBranchId) {
                        const branch = branches?.find((b: any) => b.id === selectedBranchId);
                        const selectedDistrict = districts?.find(d => d.id === newDistrictId);
                        if (branch && selectedDistrict && (branch as any).district !== selectedDistrict.name) {
                          onBranchIdChange(undefined);
                        }
                      }
                    }}
                    className="text-sm"
                  />
                </div>
                
                <div className="flex-1 max-w-xs">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Branch</Label>
                  <Select
                    options={branchOptions}
                    isSearchable
                    isClearable
                    placeholder="Select branch (optional)"
                    value={branchOptions.find(
                      (option) => option.value === selectedBranchId?.toString()
                    )}
                    onChange={(option: SingleValue<{ label: string; value: string }>) => {
                      onBranchIdChange(option ? parseInt(option.value) : undefined);
                    }}
                    className="text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Export Button - Only visible for ACCOUNT-APPROVER and SUPER-ADMIN */}
      {isFilterAuthorized && (
        <div className="flex justify-end">
          <Button
            onClick={handleExportClick}
            className="shadow-lg"
            style={{ backgroundColor: "#0db0f1", borderColor: "#0db0f1" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#0ba0d8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0db0f1";
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      )}

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Harmonization Data</DialogTitle>
            <DialogDescription>
              Select the date range to export harmonization data as an Excel file.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isExporting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isExporting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowExportDialog(false);
                setStartDate("");
                setEndDate("");
              }}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || !startDate || !endDate}
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
              {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-xl shadow-sm border">
        {isFilterAuthorized ? (
          <Tabs 
            value={status} 
            className="w-full"
            onValueChange={(value) => {
              onStatusChange(value as HarmonizationStatus);
            }}
          >
            <TabsList className="grid w-full grid-cols-3 gap-2 m-4 mb-0 overflow-hidden">
              <TabsTrigger value="PENDING_KYC" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 text-xs sm:text-sm truncate">
                PENDING KYC
              </TabsTrigger>
              <TabsTrigger value="MERGED" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600 text-xs sm:text-sm truncate">
                MERGED
              </TabsTrigger>
              <TabsTrigger value="REJECTED" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-600 text-xs sm:text-sm truncate">
                REJECTED
              </TabsTrigger>
            </TabsList>
          
          <TabsContent value="PENDING_KYC" className="mt-0">
            {isLoading ? (
              <div className="p-8">
                <LoadingSkeleton />
              </div>
            ) : harmonizations.length === 0 ? (
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending KYC Harmonizations</h3>
                <p className="text-gray-600 mb-4">
                  There are no pending KYC harmonizations yet.
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
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600">Loading...</span>
                    </div>
                  </div>
                )}
                <DataTable
                  columns={harmonizationColumns}
                  data={harmonizations}
                  type="harmonization"
                  searchKey="accountNumber"
                  clickable={true}
                  onUrl={false}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="MERGED" className="mt-0">
            {isLoading && !harmonizations.length ? (
              <div className="p-8">
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            ) : harmonizations.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-block p-4 bg-green-50 rounded-full mb-4">
                  <svg
                    className="w-12 h-12 text-green-600"
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Merged Harmonizations</h3>
                <p className="text-gray-600 mb-4">
                  There are no merged harmonizations yet.
                </p>
              </div>
            ) : (
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600">Loading...</span>
                    </div>
                  </div>
                )}
                <DataTable
                  columns={harmonizationColumns}
                  data={harmonizations}
                  type="harmonization"
                  searchKey="accountNumber"
                  clickable={true}
                  onUrl={false}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="REJECTED" className="mt-0">
            {isLoading && !harmonizations.length ? (
              <div className="p-8">
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            ) : harmonizations.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-block p-4 bg-red-50 rounded-full mb-4">
                  <svg
                    className="w-12 h-12 text-red-600"
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Rejected Harmonizations</h3>
                <p className="text-gray-600 mb-4">
                  There are no rejected harmonizations yet.
                </p>
              </div>
            ) : (
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600">Loading...</span>
                    </div>
                  </div>
                )}
                <DataTable
                  columns={harmonizationColumns}
                  data={harmonizations}
                  type="harmonization"
                  searchKey="accountNumber"
                  clickable={true}
                  onUrl={false}
                />
              </div>
            )}
          </TabsContent>
          </Tabs>
        ) : (
          // For non-authorized roles, show table directly without tabs
          <div className="p-4">
            {isLoading && !harmonizations.length ? (
              <div className="p-8">
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            ) : harmonizations.length === 0 ? (
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
              </div>
            ) : (
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600">Loading...</span>
                    </div>
                  </div>
                )}
                <DataTable
                  columns={harmonizationColumns}
                  data={harmonizations}
                  type="harmonization"
                  searchKey="accountNumber"
                  clickable={true}
                  onUrl={false}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HarmonizationPresentation;

