// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDcGHXiB_9LpRkTPB8J4BpymqlY6UInq6g",
  authDomain: "v-logs.firebaseapp.com",
  projectId: "v-logs",
  storageBucket: "v-logs.firebasestorage.app",
  messagingSenderId: "629018585032",
  appId: "1:629018585032:web:8d9d14970eb57ad54e42fd",
  measurementId: "G-Y1D51D4FRZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const auth = getAuth(app);

export { app, db , auth  }; // Export db