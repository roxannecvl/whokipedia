// auth.ts
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, type Auth } from 'firebase/auth'

// Sign in function
export const signIn = (auth: Auth, email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign up function
export const signUp = (auth: Auth, email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign out function
export const signOutUser = (auth: Auth) => {
  return signOut(auth);
};

// Other authentication functions...
