import React from 'react';
import * as UI from '@chakra-ui/react';

const PrivacyWarning: React.FC = () => {
  return (
    <UI.Alert
      colorScheme="orange"
      justifyContent="center"
      fontWeight="bold"
      fontSize="sm"
    >
      <UI.Text textAlign="center">
        This is an early prototype app with very loose privacy rules. Please do
        not paste any secure or private information.
      </UI.Text>
    </UI.Alert>
  );
};

export default PrivacyWarning;
