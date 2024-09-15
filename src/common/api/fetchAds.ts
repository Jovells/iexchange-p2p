import { fetchGraphQL } from ".";
import {
    collection,
    getDocs,
    query,
    where,
  } from "firebase/firestore";
  import { db } from "../configs/firebase";
  import { writeContract } from "viem/actions";
  import { offerTypes as OFFER_TYPES } from "./constants";
import { Offer } from "./types";
  
  

export async function fetchAds(indexerUrl: string, options?: { quantity?: number, merchant?: string, page?: number, offerType: string, tokenId?: string, currency?: string, amount?: string, paymentMethod?: string}) {
  const {
    quantity = 10,
    page = 0,
    offerType, 
    tokenId,
    merchant,
    paymentMethod,
    currency,
    amount
  } = options || {};

  const operation = constructAdsQuery({
    first: quantity,
    skip: page * quantity,
    options: [
      { name: "offerType", value: OFFER_TYPES[offerType as keyof typeof OFFER_TYPES], type: "Int" },
      { name: "token", value: tokenId, type: "String" },
      { name: "currency", value: currency, type: "String" },
      { name: "merchant", value: merchant, type: "String" },
      // { name: "amount", value: amount, type: "Int" },
      { name: "paymentMethod", value: paymentMethod, type: "String" },
    ]
  })
    const graphdata = (await fetchGraphQL(indexerUrl, operation.query, "ads", operation.variables)) as { offers: Offer[] };
  
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


export function constructAdsQuery(params: {
  first: number;
  skip: number;
  options: { name: string, value: string | number |undefined, type: string }[];
}) {
  const { first, skip, options } = params;

  const variables : {[key: string]: any} = { first, skip };


  const whereClauses = options.map((option) => {
    if (!option.value) {
      return undefined;
    }
    return `${option.name}: $${option.name}`;

  }).filter(Boolean).join(", ");

  const queryVariables = options.map((option) => {
    if (!option.value) {
      return undefined;
    }
    variables[option.name] = option.value;

    return `$${option.name}: ${option.type}`;
  }).filter(Boolean).join(", ");

  return ({variables, query :`
    query ads($first: Int!, $skip: Int!, ${queryVariables}) {
      offers(first: $first, skip: $skip, where: { ${whereClauses} }) {
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
          method
        }
        currency {
          id
          currency
          isAccepted
        }
      }
    }
  `});
}
// Example usage:



