import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase/firestore";

const raw = process.env.FIREBASE_ADMIN_SDK_KEY as string;

const serviceAccount = JSON.parse(raw);

serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

const app = !getApps.length
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApps()[0];

const adminDb = getFirestore();

export { adminDb };
