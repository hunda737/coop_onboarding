import { ProspectiveDetailPresentation } from "@/components/presentation/clients";
import { 
  useGetIndividualAccountByIdQuery,
  useGetJointAccountByIdQuery,
  useGetOrganizationalAccountByIdQuery 
} from "@/features/accounts/accountApiSlice";
import { useGetClientByIdQuery } from "@/features/client/clientApiSlice";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import { useParams } from "react-router-dom";

const ProspectiveDetailContainer = () => {
  const params = useParams();
  const { data: currentUser } = useGetCurrentUserQuery();
  
  // Select the appropriate hook based on the account type (individual, joint, organizational)
  const accountId = params.prospectiveId ? params.prospectiveId : "";
  const { data: account } = useGetIndividualAccountByIdQuery(accountId) || 
                             useGetJointAccountByIdQuery(accountId) || 
                             useGetOrganizationalAccountByIdQuery(accountId);

  const { data: client } = useGetClientByIdQuery(
    params.clientId ? params.clientId : String(currentUser?.client.id)
  );

  return <ProspectiveDetailPresentation account={account} client={client} />;
};

export default ProspectiveDetailContainer;
