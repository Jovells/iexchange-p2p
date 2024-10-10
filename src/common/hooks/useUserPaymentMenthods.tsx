import { useQuery } from "@tanstack/react-query";
import { useContracts } from "../contexts/ContractContext";
import { fetchAccount } from "../api/fetchAccount";
import fetchPaymentDetails from "../api/fetchPaymentDetails";
import { useUser } from "../contexts/UserContext";

const useUserPaymentMethods = () => {
  const { address } = useUser();

  const {
    data: paymentMethods,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userPaymentMethods", address],
    queryFn: () => fetchPaymentDetails(address as string),
    enabled: !!address, // Ensures that address is truthy before making the query
    retry: 1,
    refetchOnWindowFocus: false,
  });

  console.log("fetchced user paymentMethods", paymentMethods);

  return { paymentMethods, isLoading, isFetching, refetch };
};

export default useUserPaymentMethods;
