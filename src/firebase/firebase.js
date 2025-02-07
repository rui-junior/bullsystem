
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from "firebase/database";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-Ym1RGjYFB6bTsHTkZVqpOiElz9sCV8A",
  authDomain: "bullsystem-a5fcc.firebaseapp.com",
  projectId: "bullsystem-a5fcc",
  storageBucket: "bullsystem-a5fcc.firebasestorage.app",
  messagingSenderId: "730958426927",
  appId: "1:730958426927:web:c325f2fbc8576d812327da",
  measurementId: "G-14MN8MY1SW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app)
// export const database = getDatabase(app)
export const auth = getAuth(app);