import React from 'react';

import authHelpers, { AuthHelpers, User } from './authHelpers';

export interface AuthContextProps extends AuthHelpers {
  isAuthenticated: boolean | null;
  user: User | null;
  error: string;
}

export const AuthContext = React.createContext<AuthContextProps>(
  {} as AuthContextProps
);

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  // null `isAuthenticated` value means "unknown"
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(
    null
  );
  const [user, setUser] = React.useState<User | null>(null);
  const [error, setError] = React.useState('');

  // Determine if user is authenticated
  React.useEffect(() => {
    const user = authHelpers.getUser();
    if (user) {
      setUser(user);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const signIn = async () => {
    return authHelpers
      .signIn()
      .then((result) => {
        setUser(result.user);
        setIsAuthenticated(true);
      })
      .catch((error) => {
        setError(error.message);
        return error;
      });
  };

  const signOut = async () => {
    return authHelpers.signOut().then(() => {
      setUser(null);
      setIsAuthenticated(false);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        error,
        getUser: authHelpers.getUser,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
