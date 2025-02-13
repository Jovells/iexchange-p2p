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
  import { offerTypes as OFFER_TYPES } from "../constants";
import { PaymentMethod } from "./types";
  
  

const operation = `
query paymentMethods {
  paymentMethods {
    id
    isAccepted
    method
  }
}


`;


async function fetchPaymentMethods(indexerUrl: string) {
    const graphdata = (await fetchGraphQL(indexerUrl, operation, "paymentMethods",{})) as { paymentMethods: PaymentMethod[] };

    return graphdata.paymentMethods;
  }

export default fetchPaymentMethods;