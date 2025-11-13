import { TargetPresentation } from "@/components/presentation/clients";
import {
  useGetAllDistrictsQuery,
  useGetBranchesByDistrictQuery,
} from "@/features/branches/branchApiSlice";
import { useGetClientByIdQuery } from "@/features/client/clientApiSlice";
import { useGetMyTargetsQuery } from "@/features/target/targetApiSlice";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import { useParams } from "react-router-dom";

const TargetContainer = () => {
  const params = useParams();
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: client } = useGetClientByIdQuery(
    params.clientId ? params.clientId : String(currentUser?.client.id)
  );
  const { data: districts } = useGetAllDistrictsQuery();
  const districtId = districts?.find((d) => d.name === client?.district)?.id;
  const { data: targets } = useGetMyTargetsQuery({
    districtId: Number(params.clientId) || districtId,
    year: 2025,
  });
  const { data: branches } = useGetBranchesByDistrictQuery(
    client?.district ? client?.district : ""
  );

  return (
    <TargetPresentation
      targets={targets}
      branches={branches}
      districtId={districtId}
      currentUser={currentUser}
    />
  );
};

export default TargetContainer;
