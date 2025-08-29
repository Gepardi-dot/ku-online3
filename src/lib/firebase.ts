import {initializeApp, getApp, getApps} from 'firebase/app';

const firebaseConfig = JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG!);

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
