interface Token {
  symbol: string;
  id: `0x${string}`;
}

interface Merchant {
  id: string | `0x${string}`;
  isMerchant: boolean;
  name?: string;
}

interface PaymentMethod {
  id: string;
  method: string;
}

interface Offer {
  id: string;
  maxOrder: string;
  minOrder: string;
  rate: string;
  token: Token;
  accountHash: `0x${string}`;
  active: boolean;
  merchant: Merchant;
  offerType: number;
  paymentMethod: PaymentMethod;
  depositAddress: {
    id: `0x${string}`;
  };
}

interface Currency {
  currency: string;
  id: `0x${string}`;
}

interface Order {
  accountHash: `0x${string}`;
  depositAddress: {
    id: `0x${string}`;
  };
  id: string;
  orderType: number;
  quantity: string;
  status: number;
  offer: {
    merchant: Merchant;
    id: string;
    currency: Currency;
    rate: string;
    paymentMethod: {
      method: string;
      id: string;
    }
  };
  trader: {
    id: `0x${string}`;
  };
  blockTimestamp: number;
}

interface OrderResponse {
  order: Order;
}

interface AccountDetails {
  name: string;
  number: string;
  address: string;
  hash?: string;
}
