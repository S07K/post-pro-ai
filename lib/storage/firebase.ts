import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

function getFirebaseApp() {
  return getApps()[0] ?? initializeApp(firebaseConfig);
}

/** Uploads a JPEG image buffer to Firebase Storage and returns its public URL. */
export async function uploadImage(fileName: string, data: Buffer, folderPath: string): Promise<string> {
  const storage = getStorage(getFirebaseApp());
  const storageRef = ref(storage, `${folderPath}/${fileName}`);
  const snapshot = await uploadBytes(storageRef, data, { contentType: "image/jpeg" });
  return getDownloadURL(snapshot.ref);
}
