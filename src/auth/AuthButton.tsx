import React from 'react';
import { Button } from '@chakra-ui/react';

import { signOut, useAuthState, useSignIn } from '../firebase/firebaseHelpers';

const SignOutButton: React.FC = () => {
  const [user] = useAuthState();

  return (
    <Button onClick={() => signOut()}>Sign Out {user?.displayName}</Button>
  );
};

const SignInButton: React.FC = () => {
  const [signIn, , loading] = useSignIn();

  return (
    <Button
      onClick={() => {
        signIn();
      }}
      isLoading={loading}
      isDisabled={loading}
    >
      Sign In
    </Button>
  );
};

const AuthButton: React.FC = () => {
  const [user, loading, error] = useAuthState();

  if (loading || error) return null;

  return user ? <SignOutButton /> : <SignInButton />;
};

export default AuthButton;
