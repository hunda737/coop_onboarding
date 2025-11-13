import { ClientPresentation } from "@/components/presentation/clients";
import { useGetAllClientsQuery } from "@/features/client/clientApiSlice";

const ClientContainer = () => {
  const { data: clients } = useGetAllClientsQuery();
  // console.log("data: ", clients);

  return <ClientPresentation clients={clients} />;
};

export default ClientContainer;
