import admin from 'firebase-admin';

let app;
export function getDb() {
  if (!app) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw) throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_JSON environment variable');
    const serviceAccount = JSON.parse(raw);
    app = admin.initializeApp({credential: admin.credential.cert(serviceAccount), projectId: 'kvsnvscptmock'});
  }
  return admin.firestore();
}
