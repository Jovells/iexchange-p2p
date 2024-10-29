import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../api/fetchOrders";
import { useContracts } from "../contexts/ContractContext";
import { useUser } from "../contexts/UserContext";
import { OrderState } from "../api/types";

const useMyPendingOrders = () => {
  const { indexerUrl } = useContracts();
  const { address: userAddress } = useUser();
  const options = {
    page: 0,
    quantity: 20,
    merchant: userAddress,
    trader: userAddress,
    status_not: OrderState.Released,
  };
  const {
    data: myOrders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", options],
    queryFn: () => fetchOrders(indexerUrl, options),
    enabled: !!userAddress,
    retry: false,
  });

  const total = myOrders?.length ? (myOrders.length <= 20 ? myOrders?.length.toString() : "20+") : "";

  return { myOrders, isLoading, error, total };
};

export default useMyPendingOrders;
