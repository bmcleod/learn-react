import { initializeApp } from 'firebase/app';
import { getAuth, signOut as fb_signout } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  useAuthState as fb_useAuthState,
  useSignInWithGoogle,
} from 'react-firebase-hooks/auth';
import { getFirestore } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import firebaseConfig from './firebaseConfig';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
export const firestore = getFirestore(app);
export const signOut = () => fb_signout(auth);
export const useAuthState = () => fb_useAuthState(auth);
export const useSignIn = () => useSignInWithGoogle(auth);
export const uploadImageBlob = async (blob: Blob) => {
  const blobRef = ref(storage, `/images/${uuidv4()}`);
  const snapshot = await uploadBytes(blobRef, blob);
  return getDownloadURL(snapshot.ref);
};
