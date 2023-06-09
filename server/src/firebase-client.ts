// Import the functions you need from the SDKs you need
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth'
import { getAuth, signInWithCustomToken } from 'firebase/auth'
import { getStorage } from "firebase/storage";
import { randomUUID } from 'crypto';

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};

// Initialize Firebase
export const clientApp: FirebaseApp = initializeApp(firebaseConfig)
export const clientStorage = getStorage(clientApp)

// Sign in with custom token
const authenticateClient = async () => {
    const uuid: string = randomUUID()
    const token: string = await getAdminAuth()
        .createCustomToken(uuid)
    await signInWithCustomToken(getAuth(clientApp), token)
}

authenticateClient().catch(console.error)