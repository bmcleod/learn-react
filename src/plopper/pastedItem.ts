import { PastedData } from './pastedData';
import { useAuthState } from '../auth';
import { useOwnedItemDocs, addItem, removeItem } from '../data';

export interface PastedItemInput {
  data: PastedData;
}

export interface PastedItem extends PastedItemInput {
  userId: string;
}

export interface PastedItemDocument extends PastedItem {
  id: string;
}

export interface PastedItems {
  itemDocs: PastedItemDocument[];
  add: (item: PastedItemInput) => Promise<string | undefined>;
  remove: (itemId: string) => Promise<void> | undefined;
  loading: boolean;
  errorMessage: string;
}

export const usePastedItems = (): PastedItems => {
  const [user] = useAuthState();
  const [itemDocs, loading, errorMessage] = useOwnedItemDocs();

  const add = async (item: PastedItemInput) => {
    if (!user) return;

    return addItem({
      ...item,
      userId: user?.uid,
    });
  };

  const remove = (itemId: string) => {
    return removeItem(itemId);
  };

  return { itemDocs, add, remove, loading, errorMessage };
};
