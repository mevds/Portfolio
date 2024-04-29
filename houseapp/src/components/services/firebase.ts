// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCkAEvM3TBzWCkBq-I009JI6P6PbTZVgr4",
  authDomain: "houseapp-d7989.firebaseapp.com",
  projectId: "houseapp-d7989",
  storageBucket: "houseapp-d7989.appspot.com",
  messagingSenderId: "197937781195",
  appId: "1:197937781195:web:6046f1fa568581fdf7be4e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export {db,auth,storage}