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
  import { writeContract } from "viem/actions";
  import { offerTypes as OFFER_TYPES } from "./constants";
import { Currency } from "./types";
  
  

const operation = `
  query currencies {
  currencies {
    currency
    id
    isAccepted
  }
}

`;


export async function fetchCurrencies(indexerUrl: string) {
    const graphdata = (await fetchGraphQL(indexerUrl, operation, "currencies",{})) as { currencies: Currency[] };

    return graphdata.currencies;
  }