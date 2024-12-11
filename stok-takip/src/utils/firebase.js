import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7d-BgR3ynwZdMcVGLrsdSVQYbSBktpVo",
  authDomain: "stok-takip-c8027.firebaseapp.com",
  projectId: "stok-takip-c8027",
  storageBucket: "stok-takip-c8027.firebasestorage.app",
  messagingSenderId: "2157321AIzaSyC7d27919",
  appId: "1:215732127919:web:e7ab4eca17394e09e36c5a",
};

const app = initializeApp(firebaseConfig);

const DB = getFirestore();
const AUTH = getAuth();

export { DB, AUTH };
