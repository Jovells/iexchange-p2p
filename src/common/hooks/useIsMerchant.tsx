import { useQuery } from "@tanstack/react-query";
import { useContracts } from "../contexts/ContractContext";
import { useAccount } from "wagmi";
import { fetchAccount } from "../api/fetchAccount";

const useIsMerchant = () => {
    const { indexerUrl } = useContracts();
    const { isConnected, address } = useAccount();

    // Return default values if not connected
    if (!isConnected || !address) {
        return {
            isMerchant: false,
            isLoading: false,
            isError: false,
            error: null,
        };
    }

    const { data: account, error, isLoading, isError } = useQuery({
        queryKey: ['merchantAccount', indexerUrl, address],
        queryFn: () => fetchAccount(indexerUrl, address),
        enabled: !!address, // Ensures that address is truthy before making the query
        retry: 1,
        refetchOnWindowFocus: false,
    });

    const isMerchant = account?.account?.isMerchant || false;

    return {
        isMerchant,
        isLoading,
        isError,
        error,
    };
};

export default useIsMerchant;
