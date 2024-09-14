import { fetchGraphQL } from ".";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
  } from "firebase/firestore";
  import { db } from "../configs/firebase";
import { Order, OrderOptions } from "./types";
  
  


export async function fetchOrders(indexerUrl: string,  options?: OrderOptions) {
  const {
    page = 0,
    orderType,
    quantity = 10,
    merchant,
    status,
    trader
  } = options || {};
  const variables:any = {
    first: quantity, 
    skip: page * quantity,
  }
  
  
  
  if (status) {
    variables.status = status;
  }
  if (orderType) {
    variables.orderType = orderType;
  }
  const orConditions = [];
  if (trader) {
    orConditions.push(`{ trader: $trader }`);
    variables.trader = trader;
  }
  if (merchant) {
    orConditions.push(`{ offer_: { merchant: $merchant } }`);
    variables.merchant = merchant;
  }
  const orClause = orConditions.length > 0 ? `or: [ ${orConditions.join(', ')} ]` : '';

  const operation = `
  query orders($first: Int!, $skip: Int, $orderType: Int, $trader: String, $merchant: String, $status: String) {
    orders(first: $first, skip: $skip, where: { ${orderType ? 'orderType: $orderType,' : ''}  ${orClause} ${status ? ', status: $status' : ''} }) {    
      orderType
      quantity
      blockTimestamp
      id
      trader {
        id
      }
      offer {
        rate
        currency {
        currency
        id
        isAccepted
      }
      paymentMethod {
          id
          method
          isAccepted
        }
      merchant {
        id
      }
      }
      accountHash
    }
  }
`;

    const graphdata = (await fetchGraphQL(indexerUrl, operation, "orders", variables)) as { orders: Order[] };
  
    const mechantIds = graphdata.orders.map((order) => order.offer.merchant.id);
  
    const q = query(
      collection(db, "Account"),
      where("address", "in", mechantIds)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const thisMerchantOrder = graphdata.orders.find(
        (order) => order.offer.merchant.id === data.address
      );
      thisMerchantOrder!.offer.merchant.name = data.name;
    });
    return graphdata;
  }