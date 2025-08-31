import { initializeApp, getApp, getApps, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import { credential } from 'firebase-admin';

const app = !getApps().length
  ? initializeApp({
      storageBucket: 'ku-online-fpva3.appspot.com',
    })
  : getApp();

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
