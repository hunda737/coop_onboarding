import { InactiveAccountsPresentation } from "@/components/presentation/clients";
import { 
  useGetAllIndividualAccountsQuery, 
  useGetAllJointAccountsQuery, 
  useGetAllOrganizationalAccountsQuery 
} from "@/features/accounts/accountApiSlice";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import { useParams } from "react-router-dom";

const InactiveAccountsContainer = () => {
  const params = useParams();
  const { data: currentUser } = useGetCurrentUserQuery();
  
  const clientId = params.clientId ? params.clientId : String(currentUser?.client.id);
  const accountType = params.accountType; // This should come from URL params or some other logic

  let queryResult;
  switch (accountType) {
    case 'individual':
      queryResult = useGetAllIndividualAccountsQuery({ values: "exclude", clientId });
      break;
    case 'joint':
      queryResult = useGetAllJointAccountsQuery({ values: "exclude", clientId });
      break;
    case 'organizational':
      queryResult = useGetAllOrganizationalAccountsQuery({ values: "exclude", clientId });
      break;
    default:
      queryResult = { data: undefined }; // Default case
  }

  // Extract the `data` field from the query result
  const accounts = queryResult?.data?.data ?? []; 


  return <InactiveAccountsPresentation accounts={accounts} />;
};

export default InactiveAccountsContainer;
