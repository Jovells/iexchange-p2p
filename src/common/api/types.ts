import { Serializable } from "worker_threads";

export type Token = {
  symbol: string;
  id: `0x${string}`;
  name: string;
  isTraded?: boolean;
}

 export enum OrderState {
  pending,
  accepted,
  paid,
  appealed,
  released,
  cancelled
}

export type Merchant = {
  id: `0x${string}`;
  isMerchant: boolean;
  name?: string;
  terms?: string;
  timeLimit?: number;
}

export type PreparedCurrency = { symbol: string; name: string; id: `0x${string}`,  icon: JSX.Element };

export type PaymentMethod = {
  id?: string;
  method: string;
  isAccespted?: boolean;
  details?: string;
}

enum OfferType {
  buy = 0,
  sell = 1,
}

export type Currency ={
  currency: string;
  id: `0x${string}`;
  isAccepted: boolean;
  addedBy: string;
}

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
  currency : {
    id : `0x${string}`;
    currency : string;
    isAccepted : boolean;
  }
  depositAddress: {
    id: `0x${string}`;
  };
}


export type OrderOptions ={ 
  quantity?: number, 
  merchant?: string, 
  trader?: string, 
  page?: number, 
  orderType?: OfferType, 
  status?: OrderState,
  status_not?: OrderState
}

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
  trader: {
    id: `0x${string}`;
  };
  blockTimestamp: number;
}

export type OrderResponse = {
  order: Order | null;
}

export type AccountDetails = {
  name: string;
  number: string;
  address: string;
  hash?: string;
  paymentMethod?: string;
  details?: string;
}
