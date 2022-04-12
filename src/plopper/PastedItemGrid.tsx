import React from 'react';
import _ from 'lodash';
import * as UI from '@chakra-ui/react';
import StackGrid from 'react-stack-grid';

import useMonitorStackGridImages from '../helpers/useMonitorStackGridImages';
import { usePlopper } from './PlopperProvider';
import PastedItemView from './PastedItemView';

const PastedItemGrid: React.FC<{ columnWidth?: number }> = ({
  columnWidth = 480,
}) => {
  const pastingContext = usePlopper();
  const [imageContainerRef, stackGridRef] = useMonitorStackGridImages();

  return (
    <UI.Box ref={imageContainerRef}>
      {_.isEmpty(pastingContext.itemDocs) ? null : (
        <StackGrid
          ref={stackGridRef}
          columnWidth={columnWidth}
          gutterWidth={12}
          gutterHeight={12}
          duration={300}
        >
          {pastingContext.itemDocs
            .slice()
            .reverse()
            .map((itemDoc) => (
              <PastedItemView
                key={itemDoc.id}
                item={itemDoc}
                onRemoveClick={() => pastingContext.remove(itemDoc.id)}
                width={columnWidth}
              />
            ))}
        </StackGrid>
      )}
    </UI.Box>
  );
};

export default PastedItemGrid;
