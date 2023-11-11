import firebase from './firebaseConfig';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(firebase);

// Sign Up Function
export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // User successfully created
        console.log("User created: ", userCredential.user);
    } catch (error) {
        console.error("Error signing up: ", error.message);
    }
};

// Sign In Function
export const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // User successfully signed in
        console.log("User signed in: ", userCredential.user);
    } catch (error) {
        console.error("Error signing in: ", error.message);
    }
};
