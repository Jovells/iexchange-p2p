import { ACCEPTED_CURRENCIES, ACCEPTED_TOKENS, PAYMENT_METHODS } from "@/common/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { fetchTokens } from "@/common/api/fetchTokens";
import { fetchCurrencies } from "@/common/api/fetchCurrencies";
import fetchContractPaymentMethods from "@/common/api/fetchContractPaymentMethods";
import { useContracts } from "../contexts/ContractContext";
import { currencyIcons } from "../data/currencies";

type UseMarketDataProps = {
  enablePaymentMethods?: boolean;
  enabletokens?: boolean;
  enableCurrencies?: boolean;
};

const useMarketData = (options?: UseMarketDataProps) => {
  const { enablePaymentMethods = true, enabletokens = true, enableCurrencies = true } = options || {};
  const { indexerUrl } = useContracts();
  const { data: acceptedCurrencies, isLoading: isCurrenciesLoading } = useQuery({
    queryKey: ACCEPTED_CURRENCIES(indexerUrl),
    queryFn: () => fetchCurrencies(indexerUrl),
    enabled: !!indexerUrl && enableCurrencies,
  });

  const currencies = acceptedCurrencies
    ?.map(currency => ({
      symbol: currency.currency,
      name: currency.currency,
      id: currency.id,
      icon: currencyIcons[currency.currency],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const { data: paymentMethods, isLoading: isPaymentMethodsLoading } = useQuery({
    queryKey: PAYMENT_METHODS(indexerUrl),
    queryFn: () => fetchContractPaymentMethods(indexerUrl),
    enabled: !!indexerUrl && enablePaymentMethods,
  });

  const { data: tokens, isLoading: isTokensLoading } = useQuery({
    queryKey: ACCEPTED_TOKENS(indexerUrl),
    queryFn: () => fetchTokens(indexerUrl),
    enabled: !!indexerUrl && enabletokens,
  });

  return {
    isLoading: isCurrenciesLoading || isPaymentMethodsLoading || isTokensLoading,
    currencies,
    acceptedCurrencies,
    paymentMethods,
    tokens,
  };
};

export default useMarketData;
