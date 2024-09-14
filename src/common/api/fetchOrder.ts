const operation = `
  query order ($orderId: String!) {
    order(id: $orderId) {
      accountHash
      depositAddress {
        id
      }
      id
      orderType
      quantity
      status
      offer {
      merchant {
        id
      }
      id
      rate
      currency {
        currency 
        id
      }
      paymentMethod {
        method
        id
      }
        offerType
    }
      trader {
        id
      }
      blockTimestamp
    }
  }
`;

import {
  collection,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../configs/firebase";
import { fetchGraphQL } from ".";

// Create a query against the collection.

export default async function fetchOrder(indexerUrl: string, orderId: string) {
  console.log("fetching order", indexerUrl, orderId) ;
  const graphdata = (await fetchGraphQL(indexerUrl, operation, "order", {
    orderId,
  })) as OrderResponse;

  const data = graphdata.order;
  const docRef = doc(db, "Account", data.accountHash);
  const docSnap = await getDoc(docRef);
  const merchant = docSnap.data();
  console.log("Merchant data", merchant);
  data.offer.merchant.name = merchant?.name;

  return data;
}
