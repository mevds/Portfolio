// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBAGCQsRiZ0atAlGkGNCskkGY71hIrKFxY",
  authDomain: "carshop-55c70.firebaseapp.com",
  projectId: "carshop-55c70",
  storageBucket: "carshop-55c70.appspot.com",
  messagingSenderId: "805709964969",
  appId: "1:805709964969:web:3b22777da20bb987dc6bb8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export {db,auth,storage}