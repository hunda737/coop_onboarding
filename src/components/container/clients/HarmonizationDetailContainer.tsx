import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import {
  useGetHarmonizationByIdQuery,
  useReviewHarmonizationMutation,
} from "@/features/harmonization/harmonizationApiSlice";
import HarmonizationDetailPresentation from "@/components/presentation/clients/HarmonizationDetailPresentation";

const HarmonizationDetailContainer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    toast.error("Harmonization ID is required.");
    return null;
  }

  const harmonizationId = parseInt(id, 10);
  if (isNaN(harmonizationId)) {
    toast.error("Invalid harmonization ID.");
    return null;
  }

  const { data: harmonization, isLoading } = useGetHarmonizationByIdQuery(harmonizationId);
  const { data: currentUser } = useGetCurrentUserQuery();
  const [reviewHarmonization] = useReviewHarmonizationMutation();

  const handleMerge = async () => {
    if (!harmonization?.id) {
      toast.error("Harmonization ID is missing.");
      return;
    }

    try {
      await reviewHarmonization({
        harmonizationRequestId: harmonization.id,
        decision: "MERGE",
      }).unwrap();
      toast.success("Harmonization merged successfully.");
      navigate("/harmonization");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to merge harmonization.");
    }
  };

  const handleReject = async (rejectionReason: string) => {
    if (!harmonization?.id) {
      toast.error("Harmonization ID is missing.");
      return;
    }

    if (!rejectionReason.trim()) {
      toast.error("Rejection reason is required.");
      return;
    }

    try {
      await reviewHarmonization({
        harmonizationRequestId: harmonization.id,
        decision: "REJECT",
        rejectionReason: rejectionReason.trim(),
      }).unwrap();
      toast.success("Harmonization rejected successfully.");
      navigate("/harmonization");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reject harmonization.");
    }
  };

  return (
    <HarmonizationDetailPresentation
      harmonization={harmonization}
      isLoading={isLoading}
      handleMerge={handleMerge}
      handleReject={handleReject}
      currentUser={currentUser}
    />
  );
};

export default HarmonizationDetailContainer;

