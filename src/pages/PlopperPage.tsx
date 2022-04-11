import React from 'react';
import _ from 'lodash';
import * as UI from '@chakra-ui/react';
import SanitizedHTML from 'react-sanitized-html';
import sanitizeHTML from 'sanitize-html';
import StackGrid from 'react-stack-grid';
import isURL from 'is-url';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  addDoc,
  deleteDoc,
  doc,
  collection,
  query,
  where,
} from 'firebase/firestore';

import {
  firestore,
  uploadImageBlob,
  useAuthState,
} from '../firebase/firebaseHelpers';
import AuthButton from '../components/AuthButton';
import PrivacyWarning from '../components/PrivacyWarning';

const COLUMN_WIDTH = 480;

interface PastedTextData {
  type: 'text';
  text: {
    plain: string;
    html: string;
  };
}

interface PastedImageData {
  type: 'image';
  src: string;
}

interface PastedURLData {
  type: 'url';
  url: string;
  meta: Partial<{
    description: string;
    image: string;
    title: string;
  }>;
}

interface PastedPlayerData {
  type: 'player';
  url: string;
}

type PastedData =
  | PastedTextData
  | PastedImageData
  | PastedURLData
  | PastedPlayerData;

interface PastedItem {
  userId: string;
  data: PastedData;
}
interface PastedItemDocument {
  id: string;
  data: PastedItem;
}

const usePastedItems = (): PlopperShape => {
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
      data: doc.data() as PastedItem,
    })) || [];

  const loading = authStateLoading || itemsLoading;
  const errorMessage = authStateError?.message || itemsError?.message || '';

  const add = async (item: Partial<PastedItem>) => {
    if (!user) return;

    const result = await addDoc(collection(firestore, 'items'), {
      ...item,
      userId: user?.uid,
    });

    return result.id;
  };

  const remove = (itemId: string) => {
    return deleteDoc(doc(firestore, 'items', itemId));
  };

  return { docs, add, remove, loading, errorMessage };
};

const getPastedData = async (): Promise<PastedData> => {
  // Detect URL
  const text = await window.navigator.clipboard.readText();
  if (text) {
    if (isURL(text)) {
      if (ReactPlayer.canPlay(text)) {
        return {
          type: 'player',
          url: text,
        };
      } else {
        const result = await axios.get('/api/metascraper', {
          params: { url: text },
        });
        return {
          type: 'url',
          url: text,
          meta: result.data,
        };
      }
    }
  }

  const data = await window.navigator.clipboard.read();
  const clipboardItem = data[0];

  const result: any = {};

  for (const type of clipboardItem.types) {
    const [mainType, subType] = type.split('/');
    const blob = await clipboardItem.getType(type);
    result.type = mainType;

    if (mainType === 'text') {
      const text = result.text || {};
      text[subType] = await blob.text();
      result.text = text;
    }

    if (mainType === 'image') {
      // const dataURL = await readFileAsync(blob);
      // result.src = dataURL.toString() || '';
      const remoteURL = await uploadImageBlob(blob);
      result.src = remoteURL;
      return result;
    }
  }
  return result;
};

const usePasteCallback = (onPaste: (data: PastedData) => any) => {
  React.useEffect(() => {
    const handlePaste = async () => {
      try {
        const pastedData = await getPastedData();
        onPaste(pastedData);
      } catch (e) {
        console.error(
          'Pasted contents could not be read. Did you try to paste a file?',
          e
        );
      }
    };

    window.document.body.addEventListener('paste', handlePaste);

    return () => {
      window.document.body.removeEventListener('paste', handlePaste);
    };
  }, [onPaste]);
};

const useInnerElementBackgroundColor = (query: string) => {
  const ref = React.useRef<any>(null);
  const [backgroundColor, setBackgroundColor] = React.useState('white');

  React.useEffect(() => {
    if (ref.current) {
      const element = ref.current.querySelector(query) as
        | HTMLElement
        | undefined;
      if (!element) {
        return;
      }
      setBackgroundColor(element.style.backgroundColor);
    }
  }, [query, ref, setBackgroundColor]);

  return { ref, backgroundColor };
};

interface PlopperShape {
  docs: PastedItemDocument[];
  add: (item: Partial<PastedItem>) => Promise<string | undefined>;
  remove: (itemId: string) => Promise<void> | undefined;
  loading: boolean;
  errorMessage: string;
}

const PlopperContext = React.createContext<PlopperShape>({} as PlopperShape);

const usePlopper = () => React.useContext(PlopperContext);

const PlopperProvider: React.FC = ({ children }) => {
  const pastedItems = usePastedItems();

  const { add } = pastedItems;

  const handlePaste = React.useCallback(
    (data: PastedData) => {
      add({ data });
    },
    [add]
  );

  usePasteCallback(handlePaste);

  return (
    <PlopperContext.Provider value={pastedItems}>
      {children}
    </PlopperContext.Provider>
  );
};

const PastedItemWrapper = React.forwardRef<HTMLDivElement, UI.BoxProps>(
  (props, ref) => {
    return (
      <UI.Box
        ref={ref}
        bg="white"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        {...props}
      />
    );
  }
);

const HTMLTextItem: React.FC<{ item: PastedItem }> = ({ item }) => {
  const { ref, backgroundColor } = useInnerElementBackgroundColor(':scope>*>*');

  if (item.data.type !== 'text') return null;

  return (
    <PastedItemWrapper ref={ref} bg={backgroundColor}>
      <SanitizedHTML
        allowedAttributes={{
          ...sanitizeHTML.defaults.allowedAttributes,
          '*': ['style'],
        }}
        html={item.data.text.html}
      />
    </PastedItemWrapper>
  );
};

const PlainTextItem: React.FC<{ item: PastedItem }> = ({ item }) => {
  if (item.data.type !== 'text') return null;

  return (
    <PastedItemWrapper>
      {item.data.text.plain.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </PastedItemWrapper>
  );
};

const ImageItem: React.FC<{ item: PastedItem }> = ({ item }) => {
  if (item.data.type !== 'image') return null;

  return (
    <PastedItemWrapper p={0}>
      <UI.Image src={item.data.src} alt="..." w="100%" />
    </PastedItemWrapper>
  );
};

const URLItem: React.FC<{ item: PastedItem }> = ({ item }) => {
  if (item.data.type !== 'url') return null;

  const url = new URL(item.data.url);
  const meta = item.data.meta;

  return (
    <PastedItemWrapper p={0}>
      <UI.Box as="a" href={url.toString()} target="_blank">
        <UI.Image src={meta.image} alt={meta.description} />
        <UI.Box p={4}>
          <UI.Text fontWeight="bold" mb={2}>
            {meta.title}
          </UI.Text>
          <UI.Text color="gray.500" fontSize="sm">
            {url.hostname}
          </UI.Text>
        </UI.Box>
      </UI.Box>
    </PastedItemWrapper>
  );
};

const PlayerItem: React.FC<{ item: PastedItem }> = ({ item }) => {
  if (item.data.type !== 'player') return null;

  const playerAspectRatio = 16 / 9;
  const width = COLUMN_WIDTH;
  const height = Math.floor(width / playerAspectRatio);

  return (
    <PastedItemWrapper p={0}>
      <ReactPlayer url={item.data.url} width={width} height={height} />
    </PastedItemWrapper>
  );
};

const PastedItemGridItem: React.FC<{
  item: PastedItem;
  onRemoveClick: () => any;
}> = ({ item, onRemoveClick }) => {
  return (
    <UI.Box position="relative">
      <UI.Button
        position="absolute"
        top={2}
        right={2}
        onClick={onRemoveClick}
        size="xs"
        colorScheme="red"
      >
        Delete
      </UI.Button>

      {item.data.type === 'text' ? (
        <React.Fragment>
          {item.data.text.html ? (
            <HTMLTextItem item={item} />
          ) : (
            <PlainTextItem item={item} />
          )}
        </React.Fragment>
      ) : null}
      {item.data.type === 'image' ? <ImageItem item={item} /> : null}
      {item.data.type === 'url' ? <URLItem item={item} /> : null}
      {item.data.type === 'player' ? <PlayerItem item={item} /> : null}
    </UI.Box>
  );
};

const PastedItemGrid: React.FC = () => {
  const pastingContext = usePlopper();

  return (
    <React.Fragment>
      {_.isEmpty(pastingContext.docs) ? null : (
        <StackGrid
          columnWidth={COLUMN_WIDTH}
          gutterWidth={12}
          gutterHeight={12}
          duration={300}
          monitorImagesLoaded={true}
        >
          {pastingContext.docs
            .slice()
            .reverse()
            .map((doc) => (
              <PastedItemGridItem
                key={doc.id}
                item={doc.data}
                onRemoveClick={() => pastingContext.remove(doc.id)}
              />
            ))}
        </StackGrid>
      )}
      <UI.Box textAlign="center" p={4} mt={8}>
        <UI.Heading size="md" mb={4}>
          Try pasting something!
        </UI.Heading>
        <UI.List color="gray.500" fontSize="sm">
          <UI.ListItem>Plain text or rich text</UI.ListItem>
          <UI.ListItem>Images or links</UI.ListItem>
          <UI.ListItem>Videos from YouTube or Twitch</UI.ListItem>
        </UI.List>
      </UI.Box>
    </React.Fragment>
  );
};

const PlopperPageInner: React.FC = () => {
  return (
    <PlopperProvider>
      <UI.Box p={4}>
        <PastedItemGrid />
      </UI.Box>
    </PlopperProvider>
  );
};

const PlopperPage: React.FC = () => {
  const [user] = useAuthState();

  if (!user) return null;

  return (
    <React.Fragment>
      <PrivacyWarning />
      <AuthButton />
      <UI.Heading textAlign="center" my={4} color="gray.500">
        plopper.
      </UI.Heading>
      <PlopperPageInner />
    </React.Fragment>
  );
};

export default PlopperPage;
