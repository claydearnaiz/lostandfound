import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBNLQ7baBkCTMsRLfOJr_dULNV0pLDvG_w",
  authDomain: "techno-25b14.firebaseapp.com",
  projectId: "techno-25b14",
  storageBucket: "techno-25b14.firebasestorage.app",
  messagingSenderId: "1017116187142",
  appId: "1:1017116187142:web:71cba4cb9899599df1c187"
};

const app = initializeApp(firebaseConfig);

export const dbInstance = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
