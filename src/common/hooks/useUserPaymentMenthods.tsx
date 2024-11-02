import { useQuery } from "@tanstack/react-query";
import { useContracts } from "../contexts/ContractContext";
import { fetchAccount } from "../api/fetchAccount";
import fetchPaymentDetails from "../api/fetchPaymentDetails";
import { useUser } from "../contexts/UserContext";

const useUserPaymentMethods = ({ enabled = true } = {}) => {
  const { address } = useUser();

  const {
    data: paymentMethods,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userPaymentMethods", address],
    queryFn: () => fetchPaymentDetails(address as string),
    enabled: !!address && enabled,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  console.log("fetchced user paymentMethods", paymentMethods);

  return { paymentMethods, isLoading, isFetching, refetch };
};

export default useUserPaymentMethods;
