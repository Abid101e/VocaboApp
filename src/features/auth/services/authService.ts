import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../../../services/firebase';

const mapAuthError = (error: unknown): never => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        throw new Error('Invalid email or password.');
      case 'auth/email-already-in-use':
        throw new Error('An account with this email already exists.');
      case 'auth/weak-password':
        throw new Error('Password must be at least 6 characters.');
      case 'auth/invalid-email':
        throw new Error('Please enter a valid email address.');
      case 'auth/too-many-requests':
        throw new Error('Too many attempts. Please try again later.');
      case 'auth/network-request-failed':
        throw new Error('Network error. Please check your connection.');
    }
  }
  throw new Error('Something went wrong. Please try again.');
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    mapAuthError(error);
  }
};

export const registerWithEmail = async (email: string, password: string) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    mapAuthError(error);
  }
};

export const signInWithGoogle = async (idToken: string) => {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    return await signInWithCredential(auth, credential);
  } catch (error) {
    mapAuthError(error);
  }
};

export const signOut = () => firebaseSignOut(auth);
