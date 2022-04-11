import React from 'react';

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

export default useInnerElementBackgroundColor;
