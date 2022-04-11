import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

import { app } from '../firebase';

export const storage = getStorage(app);
export const uploadImageBlob = async (blob: Blob) => {
  const blobRef = ref(storage, `/images/${uuidv4()}`);
  const snapshot = await uploadBytes(blobRef, blob);
  return getDownloadURL(snapshot.ref);
};
