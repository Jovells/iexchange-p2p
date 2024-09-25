import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../configs/firebase";
import { PaymentMethod } from "./types";

export default  async (address: string) => {
const paymentMethodsRef = collection(db, `Users/${address}/paymentMethods`);
        const q = query(paymentMethodsRef);
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const paymentMethods = snapshot.docs.map((doc) => doc.data());
          console.log(paymentMethods);
          return paymentMethods as PaymentMethod[];
        } else {
          throw new Error('No payment methods found');
        }

    }