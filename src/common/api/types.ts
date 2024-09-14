export interface Token {
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

export interface Merchant {
  id: string | `0x${string}`;
  isMerchant: boolean;
  name?: string;
}

export interface PaymentMethod {
  id: string;
  method: string;
  isAccespted: boolean;
}

enum OfferType {
  buy = 0,
  sell = 1,
}

export interface Currency{
  currency: string;
  id: `0x${string}`;
  isAccepted: boolean;
  addedBy: string;
}

export interface Offer {
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
  depositAddress: {
    id: `0x${string}`;
  };
}

export interface Currency {
  currency: string;
  id: `0x${string}`;
}

export interface OrderOptions{ 
  quantity?: number, 
  merchant?: string, 
  trader?: string, 
  page?: number, 
  orderType?: OfferType, 
  status?: OrderState }

export interface Order {
  accountHash: `0x${string}`;
  depositAddress: {
    id: `0x${string}`;
  };
  id: string;
  orderType: number;
  quantity: string;
  status: OrderState;
  offer: {
    merchant: Merchant;
    id: string;
    currency: Currency;
    rate: string;
    paymentMethod: {
      method: string;
      id: string;
    }
    offerType: OfferType;
  };
  trader: {
    id: `0x${string}`;
  };
  blockTimestamp: number;
}

export interface OrderResponse {
  order: Order;
}

export interface AccountDetails {
  name: string;
  number: string;
  address: string;
  hash?: string;
}
