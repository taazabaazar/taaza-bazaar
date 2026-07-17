import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// Your Firebase project config (from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyDM-upkWhqXWcC_mfkrf0AnNlboY1pihlI",
  authDomain: "taaza-baazar.firebaseapp.com",
  projectId: "taaza-baazar",
  storageBucket: "taaza-baazar.firebasestorage.app",
  messagingSenderId: "253478066447",
  appId: "1:253478066447:web:1e6f37b8ccb2ed42d1867a",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const COLLECTION = "taaza_bazaar_data";

export const storage = {
  async get(key) {
    const ref = doc(db, COLLECTION, key);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      throw new Error("not found: " + key);
    }
    return { key, value: snap.data().value };
  },
  async set(key, value) {
    const ref = doc(db, COLLECTION, key);
    await setDoc(ref, { value, updatedAt: new Date().toISOString() });
    return { key, value };
  },
};
