import { fetchGraphQL } from ".";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../configs/firebase";
import { writeContract } from "viem/actions";
import { offerTypes as OFFER_TYPES } from "../constants";
import { Offer } from "./types";

interface FetchAdsOptions {
  quantity?: number;
  page?: number;
  offerType?: string;
  tokenId?: string;
  merchant?: string;
  paymentMethod?: string;
  currency?: string;
  amount?: string;
  orderBy?: string;
  orderDirection?: string;
  isActive?: boolean;
}

export async function fetchTotalAds(indexerUrl: string, options?: FetchAdsOptions) {
  const { offerType, tokenId, merchant, paymentMethod, currency, amount, isActive } = options || {};

  const realAmount = amount ? (parseFloat(amount) * 10 ** 18).toString() : undefined;

  const operation = constructAdsQuery({
    options: [
      { name: "offerType", value: OFFER_TYPES[offerType as keyof typeof OFFER_TYPES], type: "Int" },
      { name: "token", value: tokenId, type: "String" },
      { name: "currency", value: currency, type: "String" },
      { name: "active", value: isActive, type: "Boolean" },
      { name: "merchant", value: merchant, type: "String" },
      { name: "maxOrder_gt", value: realAmount, type: "String" },
      { name: "minOrder_lt", value: realAmount, type: "String" },
      { name: "paymentMethod", value: paymentMethod, type: "String" },
    ],
  });
  const graphdata = (await fetchGraphQL(indexerUrl, operation.query, "totalAds", operation.variables)) as {
    offers: Offer[];
  };

  return Number(graphdata.offers[0].id);
}

export function constructAdsQuery(params: {
  options: { name: string; value: string | number | Boolean | undefined; type: string }[];
}) {
  const { options } = params;

  const variables: { [key: string]: any } = { first: 1, skip: 0, orderBy: "blockTimestamp", orderDirection: "desc" };

  const whereClauses = options
    .map(option => {
      if (option.value === null || option.value === undefined) {
        return undefined;
      }
      return `${option.name}: $${option.name}`;
    })
    .filter(Boolean)
    .join(", ");

  const queryVariables = options
    .map(option => {
      if (option.value === null || option.value === undefined) {
        return undefined;
      }
      variables[option.name] = option.value;

      return `$${option.name}: ${option.type}`;
    })
    .filter(Boolean)
    .join(", ");

  return {
    variables,
    query: `
    query ads($first: Int!, $skip: Int!, $orderBy: Order_orderBy, $orderDirection: OrderDirection, ${queryVariables}) {
      offers(first: $first, orderBy: $orderBy, orderDirection: $orderDirection,  skip: $skip, where: { ${whereClauses} }) {
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
  `,
  };
}
// Example usage:
