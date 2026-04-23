import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDj28JtZ_JbBf7Ce4Eis6grljIcFN8ZGnA",
  authDomain: "myudswater.firebaseapp.com",
  projectId: "myudswater",
  storageBucket: "myudswater.firebasestorage.app",
  messagingSenderId: "423695687323",
  appId: "1:423695687323:web:c3b1c12eb13711738ab03e",
  measurementId: "G-STY784HDW9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();


