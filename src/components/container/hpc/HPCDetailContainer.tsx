import { HPCDetailPresentation } from "@/components/presentation/hpc";
import { useGetHighProfileCustomerQuery } from "@/features/hpc/hpcApiSlice";
import { useParams } from "react-router-dom";

const HPCDetailContainer = () => {
  const params = useParams();
  const { data: hpc } = useGetHighProfileCustomerQuery({
    id: (params.customerId && Number(params.customerId)) || 0,
  });
  return (
    <div>
      <HPCDetailPresentation hpc={hpc} />
    </div>
  );
};

export default HPCDetailContainer;
