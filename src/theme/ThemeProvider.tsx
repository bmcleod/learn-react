import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.200',
      },
    },
  },
  components: {
    Link: {
      baseStyle: {
        color: 'blue.500',
        textDecoration: 'underline',
        ':hover': {
          textDecoration: 'none',
        },
      },
    },
  },
});

const ThemeProvider: React.FC = ({ children }) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};

export default ThemeProvider;
