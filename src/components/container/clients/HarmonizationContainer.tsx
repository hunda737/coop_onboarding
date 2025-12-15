import { useGetHarmonizationsQuery } from "@/features/harmonization/harmonizationApiSlice";
import HarmonizationPresentation from "@/components/presentation/clients/HarmonizationPresentation";

const HarmonizationContainer = () => {
  const { data: harmonizations, isLoading, isError, error } = useGetHarmonizationsQuery();

  // Log for debugging
  if (error) {
    console.error("Harmonization API Error:", error);
  }
  
  if (harmonizations) {
    console.log("Harmonizations data:", harmonizations);
  }

  return (
    <HarmonizationPresentation
      harmonizations={harmonizations || []}
      isLoading={isLoading}
      isError={isError}
      error={error}
    />
  );
};

export default HarmonizationContainer;

