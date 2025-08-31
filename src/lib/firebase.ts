import {initializeApp, getApp, getApps} from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  "apiKey": "AIzaSyA6cfCjR3fXwjoN10AVeM5j36WtDENP3Cc",
  "appId": "1:348003227476:web:5a2ad7e909f9483c3adac1",
  "authDomain": "ku-online-fpva3.firebaseapp.com",
  "databaseURL": "https://ku-online-fpva3-default-rtdb.europe-west1.firebasedatabase.app",
  "messagingSenderId": "348003227476",
  "projectId": "ku-online-fpva3",
  "storageBucket": "ku-online-fpva3.appspot.com"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const clientStorage = getStorage(app);

export { app, db, auth, clientStorage };
