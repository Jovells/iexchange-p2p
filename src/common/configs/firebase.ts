// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEMYYIcLFHVD3hsQsbwvN4KVeMSJxmDyo",
  authDomain: "iexchange-finance.firebaseapp.com",
  projectId: "iexchange-finance",
  storageBucket: "iexchange-finance.appspot.com",
  messagingSenderId: "281152375443",
  appId: "1:281152375443:web:26a097cac0294464c69b66",
  measurementId: "G-B45E2GG6FR",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
