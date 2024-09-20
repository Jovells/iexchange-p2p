import { useQuery } from "@tanstack/react-query";
import { useContracts } from "../contexts/ContractContext";
import { useAccount } from "wagmi";
import { fetchAccount } from "../api/fetchAccount";
import fetchPaymentDetails from "../api/fetchPaymentDetails";

const useUserPaymentMethods = () => {
    const { address } = useAccount();


    const { data: paymentMethods, isFetching, refetch } = useQuery({
        queryKey: ['userPaymentMethods', address],
        queryFn: () => fetchPaymentDetails(address as string),
        enabled: !!address, // Ensures that address is truthy before making the query
        retry: 1,
        refetchOnWindowFocus: false,
    });    

    console.log("fetchced user paymentMethods", paymentMethods);


    return {paymentMethods, isFetching, refetch}
};

export default useUserPaymentMethods;
