import React from 'react';
import * as UI from '@chakra-ui/react';

import { useAuthState } from '../auth';
import { SignInButton, SignOutButton } from '../auth/AuthButton';
import PrivacyWarning from './PrivacyWarning';
import PlopperProvider from './PlopperProvider';
import GetStartedTips from './GetStartedTips';
import PastedItemGrid from './PastedItemGrid';

const PlopperPage: React.FC = () => {
  const [user, loading, error] = useAuthState();

  if (loading || error) return null;

  const heading = (
    <UI.SimpleGrid columns={3} alignItems="center">
      <UI.Box />
      <UI.Heading textAlign="center" my={4} color="gray.500">
        plopper.
      </UI.Heading>
      <UI.Box textAlign="right" px={4}>
        {user ? (
          <SignOutButton colorScheme="black" variant="outline" size="xs" />
        ) : null}
      </UI.Box>
    </UI.SimpleGrid>
  );

  return user ? (
    <React.Fragment>
      <PrivacyWarning />
      {heading}
      <PlopperProvider>
        <UI.Box p={4}>
          <PastedItemGrid />
          <GetStartedTips maxWidth="420px" mx="auto" mt={8} />
        </UI.Box>
      </PlopperProvider>
    </React.Fragment>
  ) : (
    <React.Fragment>
      {heading}
      <UI.Box textAlign="center" p={4}>
        <SignInButton colorScheme="green" />
      </UI.Box>
    </React.Fragment>
  );
};

export default PlopperPage;
