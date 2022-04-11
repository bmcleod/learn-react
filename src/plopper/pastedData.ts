import React from 'react';
import isURL from 'is-url';
import ReactPlayer from 'react-player';
import axios from 'axios';

import { uploadImageBlob } from '../storage';

export interface PastedTextData {
  type: 'text';
  text: {
    plain: string;
    html: string;
  };
}

export interface PastedImageData {
  type: 'image';
  src: string;
}

export interface PastedURLData {
  type: 'url';
  url: string;
  meta: Partial<{
    description: string;
    image: string;
    title: string;
  }>;
}

export interface PastedPlayerData {
  type: 'player';
  url: string;
}

export type PastedData =
  | PastedTextData
  | PastedImageData
  | PastedURLData
  | PastedPlayerData;

export const getPastedData = async (): Promise<PastedData> => {
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
      const remoteURL = await uploadImageBlob(blob);
      result.src = remoteURL;
      return result;
    }
  }
  return result;
};

export const usePastedDataCallback = (onPaste: (data: PastedData) => any) => {
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
