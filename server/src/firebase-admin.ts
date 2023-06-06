import { initializeApp } from 'firebase-admin/app';
import { credential, firestore } from 'firebase-admin';

import serviceAccount from '../adminsdk-cert.json';

export const app = initializeApp({
    credential: credential.cert(serviceAccount as any),
});

export const db = firestore(app);