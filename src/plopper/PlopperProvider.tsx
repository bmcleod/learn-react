import React from 'react';

import { PastedData, usePastedDataCallback } from './pastedData';
import { PastedItems, usePastedItems } from './pastedItem';

export interface PlopperShape extends PastedItems {}

export const PlopperContext = React.createContext<PlopperShape>(
  {} as PlopperShape
);

export const usePlopper = () => React.useContext(PlopperContext);

export const PlopperProvider: React.FC = ({ children }) => {
  const pastedItems = usePastedItems();
  const { add } = pastedItems;

  // Automatically created a new item when data is pasted
  const handlePaste = React.useCallback(
    (data: PastedData) => {
      add({ data });
    },
    [add]
  );

  usePastedDataCallback(handlePaste);

  return (
    <PlopperContext.Provider value={pastedItems}>
      {children}
    </PlopperContext.Provider>
  );
};

export default PlopperProvider;
