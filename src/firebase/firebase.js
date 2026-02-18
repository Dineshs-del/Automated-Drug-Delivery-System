import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA9tMLbvsYJX_PH1UiekG2LZph1gjiNXok",
  authDomain: "smart-drug-delivery-system.firebaseapp.com",
  projectId: "smart-drug-delivery-system",
  storageBucket: "smart-drug-delivery-system.appspot.com",
  messagingSenderId: "61768120356",
  appId: "1:61768120356:web:9726d56a89dea5d597d4b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore DB
export const db = getFirestore(app);
