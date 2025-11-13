import {
  useGetAllAccountsQuery,
  // useGetAllIndividualAccountsQuery,
  // useGetAllJointAccountsQuery,
  // useGetAllOrganizationalAccountsQuery,
} from "@/features/accounts/accountApiSlice";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import { useParams } from "react-router-dom";
import AccountPresentation from "@/components/presentation/clients/AccountPresentation";



const AccountContainer = () => {
  const params = useParams();
  const { data: currentUser } = useGetCurrentUserQuery();
  const clientId = params.clientId || String(currentUser?.client?.id);

  const { data: allAccounts, isLoading: isLoadingAllAccounts, isError: isErrorAllAccounts } = useGetAllAccountsQuery({ values: "exclude", clientId }, { skip: !clientId });

  // const {
  //   data: individualAccounts,
  //   isLoading: isLoadingIndividual,
  //   isError: isErrorIndividual,
  // } = useGetAllIndividualAccountsQuery(
  //   { values: "exclude", clientId },
  //   { skip: !clientId }
  // );

  // const {
  //   data: jointAccounts,
  //   isLoading: isLoadingJoint,
  //   isError: isErrorJoint,
  // } = useGetAllJointAccountsQuery(
  //   { values: "exclude", clientId },
  //   { skip: !clientId }
  // );

  // const {
  //   data: organizationalAccounts,
  //   isLoading: isLoadingOrganizational,
  //   isError: isErrorOrganizational,
  // } = useGetAllOrganizationalAccountsQuery(
  //   { values: "exclude", clientId },
  //   {
  //     skip: !clientId,
  //     refetchOnMountOrArgChange: true
  //   }
  // );

  // let allAccounts = [
  //   ...(individualAccounts?.data || []),
  //   ...(jointAccounts?.data || []),
  //   ...(organizationalAccounts?.data || []),
  // ].filter(account => account.status !== "INITIAL");

  // Filter accounts for ACCOUNT-APPROVER role
  let filteredAccounts = allAccounts?.data || [];
  if (currentUser?.role === "ACCOUNT-APPROVER") {
    filteredAccounts = filteredAccounts.filter(account =>
      account.status === "AUTHORIZED" ||
      account.status === "APPROVED" ||
      account.status === "REJECTED"
    );
  }

  return (
    <AccountPresentation
      accounts={filteredAccounts}
      isLoading={isLoadingAllAccounts}
      isError={isErrorAllAccounts}
    />
  );
};

export default AccountContainer;
