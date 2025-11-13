import { CRMPresentation } from "@/components/presentation/hpc";
import { useGetCRMUsersQuery } from "@/features/crm/crmApiSlice";

const CRMContainer = () => {
  const { data: crmData } = useGetCRMUsersQuery({});
  return (
    <div className="p-5">
      <CRMPresentation crmData={crmData} />
    </div>
  );
};

export default CRMContainer;
