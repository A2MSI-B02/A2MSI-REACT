// Importation de Firebase
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

// Configuration Firebase (remplace par tes propres clés Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyDBd9qGSmQITJMPjQXqpjba3e1XGU3lZvg",
    authDomain: "a2msi-js.firebaseapp.com",
    databaseURL: "https://a2msi-js-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "a2msi-js",
    storageBucket: "a2msi-js.firebasestorage.app",
    messagingSenderId: "363843091318",
    appId: "1:363843091318:web:392b7a74a9757c0883d857"
  };

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export { createUserWithEmailAndPassword, ref, set };
