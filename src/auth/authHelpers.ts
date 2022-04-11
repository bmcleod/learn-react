import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  User,
  UserCredential,
} from 'firebase/auth';

export type { User } from 'firebase/auth';

export interface AuthHelpers {
  getUser: () => User | null;
  signIn: () => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

// https://firebase.google.com/docs/auth/web/google-signin?hl=en&authuser=0
const authHelpers: AuthHelpers = {
  getUser: () => getAuth().currentUser,
  signIn: () => signInWithPopup(getAuth(), new GoogleAuthProvider()),
  signOut: () => signOut(getAuth()),
};

export default authHelpers;
