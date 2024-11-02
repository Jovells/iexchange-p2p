import { fetchGraphQL } from ".";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../configs/firebase";
import { Order, OrderOptions } from "./types";

export async function fetchOrders(indexerUrl: string, options?: OrderOptions) {
  const {
    page = 0,
    orderType,
    quantity = 10,
    merchant,
    status,
    trader,
    status_not,
    orderBy,
    orderDirection,
  } = options || {};

  const variables: any = {
    first: quantity,
    skip: page * quantity,
    orderBy: orderBy || "blockTimestamp",
    orderDirection: orderDirection || "desc",
  };

  if (status !== undefined) {
    console.log("status", status);
    variables.status = status;
  }
  if (status_not !== undefined) {
    variables.status_not = status_not;
  }
  if (orderType !== undefined) {
    variables.orderType = orderType;
  }
  if (trader) {
    variables.trader = trader;
  }
  if (merchant) {
    variables.merchant = merchant;
  }

  const whereClause = [];
  if (orderType !== undefined) whereClause.push("{ orderType: $orderType } ");
  if (status !== undefined) whereClause.push("{ status: $status }");

  const orConditions = [];
  if (trader) orConditions.push("{ trader: $trader }");
  if (merchant) orConditions.push("{ offer_: { merchant: $merchant } }");

  if (orConditions.length > 0) {
    whereClause.push(`{or: [${orConditions.join(", ")}]}`);
  }

  const whereClauseString = whereClause.length > 0 ? `where: { and:[ ${whereClause.join(", ")} ]}` : "";

  let operation = `
  query orders($first: Int!, $skip: Int, $orderBy: Order_orderBy, $orderDirection: OrderDirection, $orderType: Int, $trader: String, $merchant: String, $status: Int, $status_not: Int) {
    orders(first: $first, orderBy: $orderBy, orderDirection: $orderDirection, skip: $skip, ${whereClauseString}) {    
      accountHash
      depositAddress {
        id
      }
      id
      orderType
      quantity
      status
      offer {
        id
        maxOrder
        minOrder
        rate
        offerType
        depositAddress {
          id
        }
        token {
          symbol
          id
        }
        active
        merchant {
          id
          isMerchant
        }
        paymentMethod {
          id
          method
        }
        currency {
          id
          currency
          isAccepted
        }
      }
      trader {
        id
      }
      blockTimestamp
    }
  }
`;

  if (status_not) {
    variables.status_not = status_not;
    operation = `
 query orders($first: Int!, $skip: Int, $orderBy: Order_orderBy, $orderDirection: OrderDirection, $orderType: Int, $trader: String, $merchant: String, $status: Int, $status_not: Int, $status_not_in: [Int!] = [4, 5]) {
  orders(
    first: $first
    skip: $skip
    orderBy: $orderBy
    orderDirection: $orderDirection,
    orderDirection: desc
    where: {and: [{or: [{trader: $trader}, {offer_: {merchant: $merchant}}]}, {status_not_in: $status_not_in}] }
  ) {
    accountHash
    depositAddress {
      id
    }
    id
    orderType
    quantity
    status
    offer {
      id
      maxOrder
      minOrder
      rate
      offerType
      depositAddress {
        id
      }
      token {
        symbol
        id
      }
      active
      merchant {
        id
        isMerchant
      }
      paymentMethod {
        id
        method
      }
      currency {
        id
        currency
        isAccepted
      }
    }
    trader {
      id
    }
    blockTimestamp
  }
}
  
  `;
  }

  const graphdata = (await fetchGraphQL(indexerUrl, operation, "orders", variables)) as { orders: Order[] };

  const mechantIds = graphdata.orders.map(order => order.offer.merchant.id);

  const q = query(collection(db, "Account"), where("address", "in", mechantIds));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(doc => {
    const data = doc.data();
    const thisMerchantOrder = graphdata.orders.find(order => order.offer.merchant.id === data.address);
    thisMerchantOrder!.offer.merchant.name = data.name;
  });
  return graphdata.orders;
}