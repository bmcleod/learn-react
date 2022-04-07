import React from 'react';
// import _ from 'lodash';
import * as UI from '@chakra-ui/react';
import useLocalStorageState from 'use-local-storage-state';
// import * as ReactHookForm from 'react-hook-form';
import SanitizedHTML from 'react-sanitized-html';
import sanitizeHTML from 'sanitize-html';

// console.log(sanitizeHTML.defaults.allowedTags);
// console.log(sanitizeHTML.defaults.allowedAttributes);

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

  return { pastedItems, addPastedItem };
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

const PasteBoxElement: React.FC<{ item: PastedItem }> = ({ item }) => {
  const santizedHtmlClassName = 'sanitized-html';
  const { ref, backgroundColor } = useInnerBackgroundColor(
    santizedHtmlClassName
  );

  return (
    <UI.Box>
      {item.data.type === 'text' ? (
        <React.Fragment>
          {item.data.text.html ? (
            <UI.Box
              ref={ref}
              bg={backgroundColor}
              // border="1px solid"
              // borderColor="black"
              borderRadius="lg"
              overflow="hidden"
              p={4}
              mb={4}
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
            <UI.Box
              bg="white"
              // border="1px solid"
              // borderColor="black"
              borderRadius="lg"
              overflow="hidden"
              p={4}
              mb={4}
            >
              {item.data.text.plain.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </UI.Box>
          )}
        </React.Fragment>
      ) : null}
      {item.data.type === 'image' ? (
        <React.Fragment>
          <UI.Box bg="gray.800" mb={4} borderRadius="lg" overflow="hidden">
            <UI.Image src={item.data.text} alt="..." />
          </UI.Box>
        </React.Fragment>
      ) : null}
    </UI.Box>
  );
};

const PasteBoxPage: React.FC = () => {
  const { pastedItems, addPastedItem } = usePastedItems();

  const handlePastedData = React.useCallback(
    (pastedData: PastedData) => {
      addPastedItem({ data: pastedData });
    },
    [addPastedItem]
  );

  usePastedData(handlePastedData);

  return (
    <UI.Box p="4" bg="gray.300">
      <UI.Heading size="3xl" mb={8}>
        PasteBox Page
      </UI.Heading>
      {pastedItems.length > 0 ? (
        pastedItems.map((item, index) => (
          <PasteBoxElement key={index} item={item} />
        ))
      ) : (
        <UI.Box>No pasted items</UI.Box>
      )}
    </UI.Box>
  );
};

export default PasteBoxPage;
