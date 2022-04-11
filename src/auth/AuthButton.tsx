import React from 'react';
import { Button } from '@chakra-ui/react';

import { useAuth } from './AuthProvider';

const AuthButton: React.FC = () => {
  const auth = useAuth();

  if (auth.isAuthenticated === null) {
    return null;
  }

  if (auth.isAuthenticated && auth.user) {
    return (
      <Button onClick={() => auth.signOut()}>
        Sign out {auth.user.displayName}
      </Button>
    );
  }

  return <Button onClick={() => auth.signIn()}>Sign in with Google</Button>;
};

export default AuthButton;
