import { useCollection } from 'react-firebase-hooks/firestore';
import {
  addDoc,
  deleteDoc,
  doc,
  collection,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';

import { app } from '../firebase';
import { useAuthState } from '../auth';
import { PastedItem, PastedItemDocument } from '../plopper/pastedItem';

export const firestore = getFirestore(app);

export const useOwnedItemDocs = (): [PastedItemDocument[], boolean, string] => {
  const [user, authStateLoading, authStateError] = useAuthState();

  const [itemsSnapshot, itemsLoading, itemsError] = useCollection(
    query(collection(firestore, 'items'), where('userId', '==', user?.uid)),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const docs: PastedItemDocument[] =
    itemsSnapshot?.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as PastedItem),
    })) || [];

  const loading = authStateLoading || itemsLoading;
  const errorMessage = authStateError?.message || itemsError?.message || '';

  return [docs, loading, errorMessage];
};

export const addItem = async (item: PastedItem) => {
  const result = await addDoc(collection(firestore, 'items'), item);
  return result.id;
};

export const removeItem = (itemId: string) => {
  return deleteDoc(doc(firestore, 'items', itemId));
};
