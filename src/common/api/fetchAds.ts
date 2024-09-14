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
import { Offer } from "./types";
  
  

export async function fetchAds(indexerUrl: string, page: number, offerType: string, options?: { quantity?: number, merchant?: string }) {
  const {
    quantity = 10,
    merchant,
  } = options || {};
  const variables:any = {
    first: quantity, 
    skip: page * quantity,
    offerType: OFFER_TYPES[offerType as keyof typeof OFFER_TYPES]
  }
  if (merchant) {
    variables.merchant = merchant;
  }
  const operation = `
  query ads($first: Int!, $skip: Int, $offerType: Int, $merchant: String) {
    offers(first: $first, skip: $skip, where: { offerType: $offerType, ${merchant ? 'merchant: $merchant,' : ''} }) {
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
`;

    const graphdata = (await fetchGraphQL(indexerUrl, operation, "ads", variables)) as { offers: Offer[] };
  
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