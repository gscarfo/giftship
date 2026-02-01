import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Nota: Questi valori dovrebbero essere idealmente variabili d'ambiente.
// Se non configurate, l'app userà dei placeholder o fallirà correttamente.
const firebaseConfig = {
  apiKey: "AIzaSy" + "Placeholder", // Inserisci la tua API Key se necessario
  authDomain: "giftship-app.firebaseapp.com",
  projectId: "giftship-app",
  storageBucket: "giftship-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);