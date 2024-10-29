import { FetchAdsOptions, OfferType } from "../api/types";

export const ORDER = ({ indexerUrl, orderId }: { indexerUrl: string; orderId: String }) => [
  "order",
  indexerUrl,
  orderId,
];
export const ADS = (indexerUrl: string, options: FetchAdsOptions) => ["ads", indexerUrl, options];
export const ACCOUNT_DETAILS = (accountHash: string) => ["accountDetails", accountHash];
export const ORDERS = ({
  currentPage,
  orderType,
  options,
}: {
  indexerUrl: string;
  currentPage: number;
  orderType: OfferType | undefined;
  options: any;
}) => ["orders", orderType, currentPage, options];
export const MY_ORDERS = (indexerUrl: string, options: any) => ["myOrders", indexerUrl, options];
export const MY_ADS = ({ indexerUrl, options }: { indexerUrl: string; options?: any }) => [
  "myAds",
  indexerUrl,
  options,
];
export const ORDER_STATUS = ({ indexerUrl, orderId }: { indexerUrl: string; orderId: string }) => [
  "orderStatus",
  indexerUrl,
  orderId,
];
export const TOKEN_BALANCES = ["readContract", { functionName: "balanceOf" }];
export const TOKEN_BALANCE = ({ address }: { address: string }) => [
  "readContract",
  { functionName: "balanceOf", args: [address] },
];
export const ACCEPTED_TOKENS = (indexerUrl: string) => ["acceptedTokens", indexerUrl];
export const ACCEPTED_CURRENCIES = (indexerUrl: string) => ["acceptedCurrencies", indexerUrl];
export const PAYMENT_METHODS = (indexerUrl: string) => ["paymentMethods", indexerUrl];
