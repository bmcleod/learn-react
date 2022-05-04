import React, { CSSProperties } from 'react';
import _ from 'lodash';
import * as UI from '@chakra-ui/react';
import StackGrid from 'react-stack-grid';

import useMonitorStackGridImages from '../helpers/useMonitorStackGridImages';
import { usePlopper } from './PlopperProvider';
import PastedItemView from './PastedItemView';
import { useDrop } from 'react-dnd';

const tagCornerTopLeft: CSSProperties = {
  top: 0,
  left: 0,
};

const tagCornerTopRight: CSSProperties = {
  top: 0,
  right: 0,
};

const tagCornerBottomLeft: CSSProperties = {
  bottom: 0,
  left: 0,
};

const tagCornerBottomRight: CSSProperties = {
  bottom: 0,
  right: 0,
};

export interface BucketProps {
  style?: CSSProperties;
}

const Bucket: React.FC<BucketProps> = ({ style }) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: 'card',
    // Props to collect
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      role={'tag-corner'}
      style={{
        backgroundColor: isOver ? 'red' : 'transparent',
        position: 'absolute',
        width: '30vw',
        height: '30vw',
        zIndex: 100,
        ...style,
      }}
    >
      {canDrop ? 'Tag Name Here' : ''}
    </div>
  );
};

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
      <Bucket style={tagCornerTopLeft} />
      <Bucket style={tagCornerBottomLeft} />
      <Bucket style={tagCornerBottomRight} />
      <Bucket style={tagCornerTopRight} />
    </UI.Box>
  );
};

export default PastedItemGrid;
