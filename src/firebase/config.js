// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Hämtar firestore för att få tillgång till min cloud db hos firestore!

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBG1U0boitqXZPXM5IskQTHfEYiMRTd4Ag",
  authDomain: "rox-book-list-with-firebase.firebaseapp.com",
  projectId: "rox-book-list-with-firebase",
  storageBucket: "rox-book-list-with-firebase.appspot.com",
  messagingSenderId: "40475039602",
  appId: "1:40475039602:web:36643d8e111dc7c3e92feb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service // Exporterar en const db för att kunna nå min databas från andra komponenter
export const db = getFirestore(app);
