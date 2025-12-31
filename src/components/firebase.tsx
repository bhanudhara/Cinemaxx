// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB49Jz4xSf222RdP3P9SfWJL-iBGxz-eqQ",
  authDomain: "tmdb-cinemaxx.firebaseapp.com",
  projectId: "tmdb-cinemaxx",
  storageBucket: "tmdb-cinemaxx.firebasestorage.app",
  messagingSenderId: "309223047376",
  appId: "1:309223047376:web:5c5f0d678db3afca2cded5",
  measurementId: "G-JYKN3EPF0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };