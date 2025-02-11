import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAfTp6pUscL31kWnhk6Qdmk-haQIprxVCQ",
  authDomain: "satanlibrary.firebaseapp.com",
  projectId: "satanlibrary",
  storageBucket: "satanlibrary.firebasestorage.app",
  messagingSenderId: "850665970268",
  appId: "1:850665970268:web:55e779198b5f181a41a499",
  measurementId: "G-LSW43PZZQL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
const auth = getAuth(app);
// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
