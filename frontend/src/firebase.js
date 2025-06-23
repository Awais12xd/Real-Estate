// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-2da59.firebaseapp.com",
  projectId: "mern-estate-2da59",
  storageBucket: "mern-estate-2da59.firebasestorage.app",
  messagingSenderId: "953099449930",
  appId: "1:953099449930:web:5740712f1e4149fb8f18b3",
  measurementId: "G-RT58BTJM05"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);