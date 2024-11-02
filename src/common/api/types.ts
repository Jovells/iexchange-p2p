import { TransactionReceipt } from "viem";
import { Serializable } from "worker_threads";

export type Token = {
  symbol: string;
  id: `0x${string}`;
  name: string;
  isTraded?: boolean;
};

export type DecodedLog = { eventname: string; args: Record<string, any> };

export interface FetchAdsOptions {
  quantity?: number;
  page?: number;
  offerType?: string;
  tokenId?: string;
  orderId?: string | number;
  merchant?: string;
  paymentMethod?: string;
  currency?: string;
  amount?: string;
  orderBy?: string;
  orderDirection?: string;
  isActive?: boolean;
  withoutBots?: boolean;
}

export enum OrderState {
  Pending,
  Accepted,
  Paid,
  Appealed,
  Released,
  Cancelled,
}

export type Merchant = {
  id: `0x${string}`;
  isMerchant?: boolean;
  name?: string;
  terms?: string;
  timeLimit?: number;
};

export type PreparedCurrency = { symbol: string; name: string; id: `0x${string}`; icon: JSX.Element };

export type PaymentMethod = {
  id?: string;
  method: string;
  isAccepted?: boolean;
  details?: string;
  icon?: JSX.Element;
  name?: string;
  number?: string;
};

export enum OfferType {
  buy = 0,
  sell = 1,
}

export type Currency = {
  currency: string;
  id: `0x${string}`;
  isAccepted: boolean;
  addedBy: string;
};

export type Offer = {
  id: string;
  maxOrder: string;
  minOrder: string;
  rate: string;
  token: Token;
  accountHash: `0x${string}`;
  active: boolean;
  merchant: Merchant;
  offerType: OfferType;
  paymentMethod: PaymentMethod;
  currency: {
    id: `0x${string}`;
    currency: string;
    isAccepted: boolean;
  };
  depositAddress: {
    id: `0x${string}`;
  };
};

export type OrderOptions = {
  quantity?: number;
  merchant?: string;
  trader?: string;
  page?: number;
  orderType?: OfferType;
  status?: OrderState;
  status_not?: OrderState;
  orderBy?: string;
  orderDirection?: string;
};

export type Order = {
  accountHash: `0x${string}`;
  depositAddress: {
    id: `0x${string}`;
  };
  id: string;
  orderType: number;
  quantity: string;
  status: OrderState;
  offer: Offer;
  trader: Merchant;
  blockTimestamp: string;
};

export type OrderResponse = {
  order: Order | null;
};
export type OrderStatusResponse = {
  order: {
    status: OrderState;
    blockTimestamp: string;
  } | null;
};

export type AccountDetails = {
  name: string;
  number: string;
  address: string;
  hash?: string;
  terms?: string;
  paymentMethod?: string;
  details?: string;
};

export type WriteContractWithToastReturnType = {
  receipt?: TransactionReceipt;
  decodedLogs?: DecodedLog[];
  txHash: string;
};
