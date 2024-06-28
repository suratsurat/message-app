import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBggrUeWWuK_IILmX4UqLQ9pqLuA6Gazu0",
  authDomain: "chatapp-174f6.firebaseapp.com",
  databaseURL: "https://chatapp-174f6-default-rtdb.firebaseio.com",
  projectId: "chatapp-174f6",
  storageBucket: "chatapp-174f6.appspot.com",
  messagingSenderId: "64204268416",
  appId: "1:64204268416:web:0471886883c0e5c29b5765"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const Auth = getAuth(app);
export const db = getDatabase(app);