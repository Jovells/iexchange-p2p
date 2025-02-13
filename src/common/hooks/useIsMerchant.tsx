import { useQuery } from "@tanstack/react-query";
import { useContracts } from "../contexts/ContractContext";
import { useReadContract } from "wagmi";
import { fetchAccount } from "../api/fetchAccount";
import { useUser } from "../contexts/UserContext";

const useIsMerchant = () => {
  const { p2p } = useContracts();
  const { address } = useUser();
  const { isConnected } = useUser();

  const {
    data: isMerchant,
    isError,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: p2p.address,
    abi: p2p.abi,
    functionName: "merchants",
    args: [address!],
    query: {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled: !!address,
    },
  });

  console.log("isMerchant", isMerchant);

  // Return default values if not connected
  if (!isConnected || !address) {
    return {
      isMerchant: false,
      isLoading: false,
      isError: false,
      error: null,
    };
  }

  return {
    isMerchant,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export default useIsMerchant;
