import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const filePath = 'build/adminsdk-cert.json';
const absolutePath = resolve(filePath);
const serviceAccount = JSON.parse(readFileSync(absolutePath, 'utf8'));

export const adminApp = initializeApp({
    credential: cert(serviceAccount),
});

export const adminDB = getFirestore(adminApp);