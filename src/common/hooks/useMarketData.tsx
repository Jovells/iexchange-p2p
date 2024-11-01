import { ACCEPTED_CURRENCIES, ACCEPTED_TOKENS, PAYMENT_METHODS } from "@/common/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { fetchTokens } from "@/common/api/fetchTokens";
import { fetchCurrencies } from "@/common/api/fetchCurrencies";
import fetchContractPaymentMethods from "@/common/api/fetchContractPaymentMethods";
import { useContracts } from "../contexts/ContractContext";
import { currencyIcons } from "../data/currencies";

const useMarketData = () => {
  const { indexerUrl } = useContracts();
  const { data: acceptedCurrencies } = useQuery({
    queryKey: ACCEPTED_CURRENCIES(indexerUrl),
    queryFn: () => fetchCurrencies(indexerUrl),
    enabled: !!indexerUrl,
  });

  const currencies = acceptedCurrencies?.map(currency => ({
    symbol: currency.currency,
    name: currency.currency,
    id: currency.id,
    icon: currencyIcons[currency.currency],
  }));

  const { data: paymentMethods } = useQuery({
    queryKey: PAYMENT_METHODS(indexerUrl),
    queryFn: () => fetchContractPaymentMethods(indexerUrl),
    enabled: !!indexerUrl,
  });

  const { data: tokens } = useQuery({
    queryKey: ACCEPTED_TOKENS(indexerUrl),
    queryFn: () => fetchTokens(indexerUrl),
    enabled: !!indexerUrl,
  });

  return {
    currencies,
    acceptedCurrencies,
    paymentMethods,
    tokens,
  };
};

export default useMarketData;
