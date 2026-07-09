import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMSazR79_JbXDz2TujJXxQ2TEjMmpSjdM",
  authDomain: "estudos-apec.firebaseapp.com",
  projectId: "estudos-apec",
  storageBucket: "estudos-apec.appspot.com",
  messagingSenderId: "184716570040",
  appId: "1:184716570040:web:9a3de33c283fbce428334d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
