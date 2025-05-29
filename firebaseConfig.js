// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAm_1R9OQRpryAG_IA-3N5Kb01dCoPa9Xk",
  authDomain: "number-182fc.firebaseapp.com",
  projectId: "number-182fc",
  storageBucket: "number-182fc.appspot.com",
  messagingSenderId: "563405616836",
  appId: "1:563405616836:web:22b73c4a8d0f7da806bb91",
  measurementId: "G-PFX792GSKY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database };
