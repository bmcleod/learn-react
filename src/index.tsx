import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { initializeApp } from 'firebase/app';

import firebaseConfig from './firebaseConfig';
import App from './App';
import reportWebVitals from './reportWebVitals';

initializeApp(firebaseConfig);

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

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
