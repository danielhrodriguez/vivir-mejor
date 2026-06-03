/* ============================================================
   firebase-config.js — Configuración e inicialización Firebase
   ============================================================ */

// Importar Firebase desde CDN (versión modular compatible con navegador)
import { initializeApp }                          from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, GoogleAuthProvider,
         signInWithPopup, signInWithEmailAndPassword,
         createUserWithEmailAndPassword,
         signOut, onAuthStateChanged }            from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc,
         updateDoc, collection, addDoc,
         query, where, getDocs, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ── Tu configuración de Firebase ─────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyBK87kzAE09YKMOZ5CDq8A53wYlppdtB_Q",
  authDomain:        "vivir-mejor-f6377.firebaseapp.com",
  projectId:         "vivir-mejor-f6377",
  storageBucket:     "vivir-mejor-f6377.firebasestorage.app",
  messagingSenderId: "865823677864",
  appId:             "1:865823677864:web:b7350815828d24c5a7519d",
  measurementId:     "G-0GTC6YVB45"
};

// ── Inicializar ───────────────────────────────────────────────────
const firebaseApp = initializeApp(firebaseConfig);
const auth        = getAuth(firebaseApp);
const db          = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();

// ── Exportar todo para uso global ─────────────────────────────────
window.FB = {
  auth, db, googleProvider,
  // Auth
  signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut, onAuthStateChanged,
  GoogleAuthProvider,
  // Firestore
  doc, setDoc, getDoc, updateDoc, collection,
  addDoc, query, where, getDocs, serverTimestamp,
};

console.log('✅ Firebase inicializado correctamente');
