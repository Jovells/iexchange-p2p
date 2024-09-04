/*
This is an example snippet - you should consider tailoring it
to your service.

Note: we only handle the first operation here
*/

export const MORPH_GOLDSKY_URL =
  "https://api.goldsky.com/api/public/project_clx6d7rlc8ppm01wb1pls7zwp/subgraphs/iexchange/morph-holesky/gn";

export const offerTypes = {
  buy: 0,
  sell: 1,
};

export async function fetchGraphQL(
  operation: string,
  operationName: string,
  variables: Record<string, any>
) {
  const result = await fetch(MORPH_GOLDSKY_URL, {
    method: "POST",
    body: JSON.stringify({
      query: operation,
      variables,
      operationName,
    }),
  });

  const resultjson = await result.json();
  console.log("ADS:", resultjson);

  return resultjson.data;
}

const operation = `
  query ads($first: Int!, $skip: Int, $offerType: Int) {
    offers(first: $first, skip: $skip, where: { offerType: $offerType }) {
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
      accountHash
      active
      merchant {
        id
        isMerchant
      }
      paymentMethod {
        id
      }
    }
  }
`;

const accountQuery = `
query merchantAccount($id:String) {
  account(id: $id) {
    id
    isMerchant
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
const citiesRef = collection(db, "Account");

// Create a query against the collection.

export async function fetchAds(page: number, offerType: string, quantity = 10) {
  const graphdata = (await fetchGraphQL(operation, "ads", {
    first: quantity,
    skip: page * 10,
    offerType: offerTypes[offerType as keyof typeof offerTypes],
  })) as { offers: Offer[] };

  const mechantIds = graphdata.offers.map((offer) => offer.merchant.id);

  const q = query(
    collection(db, "Account"),
    where("address", "in", mechantIds)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const thisMerchantOffer = graphdata.offers.find(
      (offer) => offer.merchant.id === data.address
    );
    thisMerchantOffer!.merchant.name = data.name;
  });
  return graphdata;
}

export async function fetchAccount(id: any): Promise<any> {
  const account = await fetchGraphQL(accountQuery, "merchantAccount", { id });
  console.log("DATA" + account)
  return account;
}