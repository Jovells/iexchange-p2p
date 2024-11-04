import { fetchGraphQL } from ".";
import {
    collection,
    getDocs,
    query,
    where,
  } from "firebase/firestore";
  import { db } from "../configs/firebase";
  import { writeContract } from "viem/actions";
  import { BOT_MERCHANT_ID, offerTypes as OFFER_TYPES } from "../constants";
  import { FetchAdsOptions, Offer } from "./types";



  export async function fetchAds(indexerUrl: string, options?: FetchAdsOptions) {
    console.log("fetching ads inside", options);
    const {
      quantity = 10,
      page = 0,
      offerType,
      tokenId,
      merchant,
      paymentMethod,
      currency,
      amount,
      orderBy,
      orderId,
      orderDirection,
      isActive,
      withoutBots,
    } = options || {};

    const realAmount = amount ? BigInt(Math.round(parseFloat(amount) * 10 ** 18)).toString() : undefined;

    console.log("fetching realAmount", realAmount, amount, options);

    const operation = constructAdsQuery({
      first: quantity,
      skip: page * quantity,
      orderBy: orderBy || "blockTimestamp",
      orderDirection: orderDirection || "desc",
      options: [
        { name: "offerType", value: OFFER_TYPES[offerType as keyof typeof OFFER_TYPES], type: "Int" },
        { name: "token", value: tokenId, type: "String" },
        { name: "currency", value: currency, type: "String" },
        { name: "active", value: isActive, type: "Boolean" },
        { name: "merchant", value: merchant, type: "String" },
        { name: "maxOrder_gte", value: realAmount, type: "BigInt" },
        { name: "minOrder_lte", value: realAmount, type: "BigInt" },
        { name: "paymentMethod", value: paymentMethod, type: "String" },
        { name: "rate_gt", value: "0", type: "BigInt" },
        { name: "id", value: orderId, type: "String" },
        withoutBots ? { name: "merchant_not", value: BOT_MERCHANT_ID, type: "String" } : undefined,
      ],
    });
    const graphdata = (await fetchGraphQL(indexerUrl, operation.query, "ads", operation.variables)) as {
      offers: Offer[];
      hasNext: boolean;
    };

    const mechantIds = graphdata.offers.map(offer => offer.merchant.id);
    if (mechantIds?.length) {
      const q = query(collection(db, "Account"), where("address", "in", mechantIds));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const thisMerchantOffer = graphdata.offers.find(offer => offer.merchant.id === data.address);
        if (thisMerchantOffer) {
          thisMerchantOffer.merchant = {
            ...thisMerchantOffer.merchant,
            ...data,
          };
        }
      });
    }
    const hasNext = graphdata.offers.length > quantity;
    graphdata.offers = graphdata.offers.slice(0, quantity);
    graphdata.hasNext = hasNext;
    return graphdata;
  }

  export function constructAdsQuery(params: {
    first: number;
    skip: number;
    orderBy: string;
    orderDirection: string;
    options: ({ name: string; value: string | number | Boolean | undefined; type: string } | undefined)[];
  }) {
    const { first, skip, orderBy, orderDirection, options } = params;

    const variables: { [key: string]: any } = {
      first: first + 1,
      skip,
      orderBy: orderBy,
      orderDirection: orderDirection,
    };

    const whereClauses = options
      .map(option => {
        if (option?.value === null || option?.value === undefined) {
          return undefined;
        }
        return `${option.name}: $${option.name}`;
      })
      .filter(Boolean)
      .join(", ");

    const queryVariables = options
      .map(option => {
        if (option?.value === null || option?.value === undefined) {
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
    query ads($first: Int!, $skip: Int!, $orderBy: Offer_orderBy, $orderDirection: OrderDirection, ${queryVariables}) {
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



