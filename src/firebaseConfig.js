import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "fir-3bf99.firebaseapp.com",
  databaseURL: "https://fir-3bf99-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fir-3bf99",
  storageBucket: "fir-3bf99.appspot.com",
  messagingSenderId: "832724850104",
  appId: "1:832724850104:web:83b5202a43039df770eb4d",
  measurementId: "G-LYKD561F1S"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
