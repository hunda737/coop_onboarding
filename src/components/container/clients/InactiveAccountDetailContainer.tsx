import { InactiveAccountDetailPresentation } from "@/components/presentation/clients";
import { 
  useGetIndividualAccountByIdQuery,
  useGetJointAccountByIdQuery,
  useGetOrganizationalAccountByIdQuery 
} from "@/features/accounts/accountApiSlice";
import { useParams } from "react-router-dom";

const InactiveAccountDetailContainer = () => {
  const params = useParams();
  const accountId = params.inactiveAccountId;
  
  // Assuming you can determine the account type from params or another source
  const accountType = params.accountType; // For example, 'individual', 'joint', or 'organizational'
  
  let queryResult;
  
  // Make sure accountId is defined before using it in the query
  if (accountId) {
    if (accountType === "individual") {
      queryResult = useGetIndividualAccountByIdQuery(accountId);
    } else if (accountType === "joint") {
      queryResult = useGetJointAccountByIdQuery(accountId);
    } else if (accountType === "organizational") {
      queryResult = useGetOrganizationalAccountByIdQuery(accountId);
    }
  }

  const { data: account } = queryResult || {};

  return <InactiveAccountDetailPresentation account={account} />;
};

export default InactiveAccountDetailContainer;
