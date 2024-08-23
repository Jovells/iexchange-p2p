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
    }
      trader {
        id
      }
    }
  }
`;

// Create a reference to the cities collection
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../configs/firebase";
import { writeContract } from "viem/actions";
import { fetchGraphQL } from ".";
const citiesRef = collection(db, "Account");

// Create a query against the collection.

export default async function fetchOrder(orderId: string) {
  const graphdata = (await fetchGraphQL(operation, "order", {
    orderId,
  })) as OrderResponse;

  console.log("Order data", graphdata);

  const data = graphdata.order;

  const mechantId = data.offer.merchant.id;

  const q = query(collection(db, "Account"), where("address", "==", mechantId));

  const docRef = doc(db, "Account", data.accountHash);
  const docSnap = await getDoc(docRef);
  const merchant = docSnap.data();
  console.log("Merchant data", merchant);
  data.offer.merchant.name = merchant?.name;

  return data;
}
