import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "diploma-daa14.firebaseapp.com",
  projectId: "diploma-daa14",
  storageBucket: "diploma-daa14.appspot.com",
  messagingSenderId: "795870844563",
  appId: "1:795870844563:web:466ded8ed1d006869d5f66",
};
export const app = initializeApp(firebaseConfig);
