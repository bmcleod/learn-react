import React from 'react';
import _ from 'lodash';
import * as UI from '@chakra-ui/react';
import useLocalStorageState from 'use-local-storage-state';
import SanitizedHTML from 'react-sanitized-html';
import sanitizeHTML from 'sanitize-html';
import StackGrid from 'react-stack-grid';

import createShortCode from '../helpers/createShortCode';

interface PastedTextData {
  type: 'text';
  text: {
    plain: string;
    html: string;
  };
}

interface PastedImageData {
  type: 'image';
  text: string;
}

interface PastedURLData {
  type: 'url';
  text: string;
}

type PastedData = PastedTextData | PastedImageData | PastedURLData;

interface PastedItem {
  id: string;
  data: PastedData;
}

const usePastedItems = () => {
  const [pastedItems, setPastedItems] = useLocalStorageState<PastedItem[]>(
    'pastedItems',
    []
  );

  const addPastedItem = (item: PastedItem) => {
    setPastedItems([...pastedItems, { ...item }]);
  };

  const removePastedItem = (item: PastedItem) => {
    setPastedItems(pastedItems.filter((i) => i !== item));
  };

  return { pastedItems, addPastedItem, removePastedItem };
};

const usePastedData = (handlePastedData: (item: PastedData) => any) => {
  React.useEffect(() => {
    const handlePaste = async () => {
      // TODO: detect URL, get metadata, etc.
      // const text = await window.navigator.clipboard.readText();
      // console.log('Pasted text: ', text);

      try {
        const data = await window.navigator.clipboard.read();
        const clipboardItem = data[0];

        const result: any = {};
        let run = true;

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
            run = false;
            const fileReader = new FileReader();
            fileReader.addEventListener(
              'load',
              () => {
                result.text = fileReader.result?.toString() || '';
                handlePastedData(result);
              },
              false
            );
            await fileReader.readAsDataURL(blob);
          }
        }
        if (run) {
          handlePastedData(result);
        }
      } catch (e) {
        console.error(
          'Pasted contents could not be read. Did you try to paste a file?'
        );
      }
    };

    // Auto-paste?
    // window.navigator.clipboard.readText().then((text) => {
    //   console.log(text);
    // });

    window.document.body.addEventListener('paste', handlePaste);

    return () => {
      window.document.body.removeEventListener('paste', handlePaste);
    };
  }, [handlePastedData]);
};

const useInnerBackgroundColor = (className: string) => {
  const ref = React.useRef<any>(null);
  const [backgroundColor, setBackgroundColor] = React.useState('white');

  React.useEffect(() => {
    if (ref.current) {
      const element = ref.current.getElementsByClassName(className)[0]
        .firstChild as HTMLElement | undefined;
      if (!element) {
        return;
      }
      setBackgroundColor(element.style.backgroundColor);
    }
  }, [className, ref, setBackgroundColor]);

  return { ref, backgroundColor };
};

interface PastingContextShape {
  items: PastedItem[];
  add: (item: PastedItem) => void;
  remove: (item: PastedItem) => void;
}

const PastingContext = React.createContext<PastingContextShape>(
  {} as PastingContextShape
);

const usePastingContext = () => React.useContext(PastingContext);

const PastingContextProvider: React.FC = ({ children }) => {
  const { pastedItems, addPastedItem, removePastedItem } = usePastedItems();

  const handlePastedData = React.useCallback(
    (pastedData: PastedData) => {
      addPastedItem({ id: createShortCode(), data: pastedData });
    },
    [addPastedItem]
  );

  usePastedData(handlePastedData);

  const value = {
    items: pastedItems,
    add: addPastedItem,
    remove: removePastedItem,
  };

  return (
    <PastingContext.Provider value={value}>{children}</PastingContext.Provider>
  );
};

const PasteBoxElement: React.FC<{
  item: PastedItem;
  onRemoveClick: () => any;
}> = ({ item, onRemoveClick }) => {
  const santizedHtmlClassName = 'sanitized-html';
  const { ref, backgroundColor } = useInnerBackgroundColor(
    santizedHtmlClassName
  );

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
            <UI.Box
              ref={ref}
              bg={backgroundColor}
              borderRadius="lg"
              overflow="hidden"
              p={4}
            >
              <SanitizedHTML
                className={santizedHtmlClassName}
                allowedAttributes={{
                  ...sanitizeHTML.defaults.allowedAttributes,
                  '*': ['style'],
                }}
                html={item.data.text.html}
              />
            </UI.Box>
          ) : (
            <UI.Box bg="white" borderRadius="lg" overflow="hidden" p={4}>
              {item.data.text.plain.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </UI.Box>
          )}
        </React.Fragment>
      ) : null}
      {item.data.type === 'image' ? (
        <React.Fragment>
          <UI.Box bg="gray.800" borderRadius="lg" overflow="hidden">
            <UI.Image src={item.data.text} alt="..." />
          </UI.Box>
        </React.Fragment>
      ) : null}
    </UI.Box>
  );
};

const PastedItemGrid: React.FC = () => {
  const pastingContext = usePastingContext();

  return (
    <React.Fragment>
      {_.isEmpty(pastingContext.items) ? (
        <UI.Box>No pasted items</UI.Box>
      ) : (
        <StackGrid
          columnWidth={360}
          gutterWidth={8}
          gutterHeight={8}
          duration={300}
          monitorImagesLoaded
        >
          {pastingContext.items
            .slice()
            .reverse()
            .map((item) => (
              <PasteBoxElement
                key={item.id}
                item={item}
                onRemoveClick={() => pastingContext.remove(item)}
              />
            ))}
        </StackGrid>
      )}
    </React.Fragment>
  );
};

const PasteBoxPage: React.FC = () => {
  return (
    <PastingContextProvider>
      <UI.Box p={4}>
        <PastedItemGrid />
      </UI.Box>
    </PastingContextProvider>
  );
};

export default PasteBoxPage;
