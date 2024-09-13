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


export async function fetchAds(indexerUrl: string, page: number, offerType: string, quantity = 10) {
    const graphdata = (await fetchGraphQL(indexerUrl, operation, "ads", {
      first: quantity,
      skip: page * 10,
      offerType: OFFER_TYPES[offerType as keyof typeof OFFER_TYPES],
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