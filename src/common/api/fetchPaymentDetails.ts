import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../configs/firebase";

export default  async (address: string) => {
const paymentMethodsRef = collection(db, `Users/${address}/paymentMethods`);
        const q = query(paymentMethodsRef);
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const paymentMethods = snapshot.docs.map((doc) => doc.data());
          console.log(paymentMethods);
          return paymentMethods;
        } else {
          throw new Error('No payment methods found');
        }

    }