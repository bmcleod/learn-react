import React from 'react';
import StackGrid from 'react-stack-grid';

const useMonitorStackGridImages = (): [
  React.RefObject<HTMLDivElement>,
  React.RefObject<StackGrid>
] => {
  const imageContainerRef = React.useRef<HTMLDivElement>(null);
  const stackGridRef = React.useRef<StackGrid>(null);

  React.useEffect(() => {
    const imageContainer = imageContainerRef.current;

    const handleLoad = () => {
      // @ts-ignore
      stackGridRef.current?.updateLayout();
    };

    imageContainer?.addEventListener('load', handleLoad, true);

    return () => {
      imageContainer?.removeEventListener('load', handleLoad, true);
    };
  }, [imageContainerRef, stackGridRef]);

  return [imageContainerRef, stackGridRef];
};

export default useMonitorStackGridImages;
