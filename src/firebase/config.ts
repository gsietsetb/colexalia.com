import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Utilizaremos variables de entorno en producción
// Por ahora usamos un objeto de configuración para desarrollo
const firebaseConfig = {
  apiKey: "AIzaSyB9Z7hNsc3-v1kl-kGKJKAg6GkzqM7shoc",
  authDomain: "colexalia.firebaseapp.com",
  projectId: "colexalia",
  storageBucket: "colexalia.firebasestorage.app",
  messagingSenderId: "741863498260",
  appId: "1:741863498260:web:c5e5201bfd88a01fd57d01",
  measurementId: "G-5WEYYTPTPB"
}

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 