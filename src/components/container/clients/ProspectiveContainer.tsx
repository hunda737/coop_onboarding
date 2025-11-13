// src/components/container/clients/ProspectiveContainer.tsx
import {
  useGetAllAccountsQuery,
  // useGetAllIndividualAccountsQuery,
  // useGetAllJointAccountsQuery,
  // useGetAllOrganizationalAccountsQuery,
} from "@/features/accounts/accountApiSlice";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import { useParams } from "react-router-dom";
// import { useEffect } from "react";
import ProspectivePresentation from "@/components/presentation/clients/ProspectivePresentation";
const ProspectiveContainer = () => {
  const params = useParams();
  const { data: currentUser } = useGetCurrentUserQuery();
  const clientId = params.clientId || String(currentUser?.client?.id);

  const { data: allAccounts, isLoading: isLoadingAllAccounts, isError: isErrorAllAccounts } = useGetAllAccountsQuery({ values: "include", clientId }, { skip: !clientId });

  // Fetch all account types
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
  //   refetch: refetchOrganizational,
  // } = useGetAllOrganizationalAccountsQuery(
  //   { values: "exclude", clientId },
  //   {
  //     skip: !clientId,
  //     refetchOnMountOrArgChange: true,
  //   }
  // );

  // Debugging

  // useEffect(() => {
  //   // console.log("Current clientId:", clientId);
  //   // console.log("Organizational accounts:", organizationalAccounts);

  //   if (organizationalAccounts?.data?.length === 0) {
  //     console.warn("No organizational accounts - refetching");
  //     refetchOrganizational();
  //   }
  // }, [organizationalAccounts, clientId, refetchOrganizational]);

  // // Combine accounts and filter only those with "INITIAL" status
  // const allAccounts = [
  //   ...(individualAccounts?.data || []),
  //   ...(jointAccounts?.data || []),
  //   ...(organizationalAccounts?.data || []),
  // ].filter((account) => account.status === "INITIAL");


  return (
    <ProspectivePresentation
      accounts={allAccounts?.data || []}
      isLoading={isLoadingAllAccounts}
      isError={isErrorAllAccounts}
    />
  );
};

export default ProspectiveContainer;
