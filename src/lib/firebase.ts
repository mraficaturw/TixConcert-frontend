import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC2L6OXf1rQSnUuM30cCEMMRzXTW84AmQ0",
    authDomain: "tixconcert-181f5.firebaseapp.com",
    projectId: "tixconcert-181f5",
    storageBucket: "tixconcert-181f5.firebasestorage.app",
    messagingSenderId: "503414640240",
    appId: "1:503414640240:web:9bafa696a5e7354b072eb5",
    measurementId: "G-TF4PHTCZYS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<string> {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();
        return idToken;
    } catch (error) {
        console.error('Google sign-in error:', error);
        throw error;
    }
}

export async function signOutFromFirebase(): Promise<void> {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Sign-out error:', error);
        throw error;
    }
}
