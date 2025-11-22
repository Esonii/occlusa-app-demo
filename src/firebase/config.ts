// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXZrfSer6B2m7fRsBRF2Qnjw9manohcuI",
  authDomain: "dental-business-40508.firebaseapp.com",
  projectId: "dental-business-40508",
  storageBucket: "dental-business-40508.firebasestorage.app",
  messagingSenderId: "609242666075",
  appId: "1:609242666075:web:458781ac304cc85a929b7e",
  measurementId: "G-N3V358RJ1J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Firestore database instance
export const db = getFirestore(app);
export const auth = getAuth(app);
export { app, analytics };

