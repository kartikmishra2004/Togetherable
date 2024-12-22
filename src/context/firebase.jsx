import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase, set, ref } from 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyBR0he9feN636824JXry5H6vzUK5CSeDmI",
    authDomain: "sample-app-b0863.firebaseapp.com",
    projectId: "sample-app-b0863",
    storageBucket: "sample-app-b0863.firebasestorage.app",
    messagingSenderId: "185289007087",
    appId: "1:185289007087:web:b3c5646be3dd2fa0eae01a",
    databaseURL: 'https://sample-app-b0863-default-rtdb.firebaseio.com/'
};
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
firebaseAuth.languageCode = 'en';
const database = getDatabase();
const provider = new GoogleAuthProvider();

const FirebaseContext = createContext(null);

export const useFirebase = () => {
    return useContext(FirebaseContext);
}

export const FirebaseProvider = (props) => {

    // Methood for signup
    const signupWithEmailAndPassword = (email, password) => {
        return createUserWithEmailAndPassword(firebaseAuth, email, password)
    }

    // Method for login
    const signinWithEmailAndPassword = (email, password) => {
        return signInWithEmailAndPassword(firebaseAuth, email, password)
    }

    // Method for login with google
    const continueWithGoogle = () => {
        signInWithPopup(firebaseAuth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const user = result.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log(error);
            });
    }

    // Method for putting data into realtime DB
    const putData = (key, data) => {
        return set(ref(database, key), data)
    }

    // Checking users auth state
    const [user, setUser] = useState(null);
    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        })
    }, [])

    return (
        <FirebaseContext.Provider
            value={{
                signupWithEmailAndPassword,
                signinWithEmailAndPassword,
                continueWithGoogle,
                putData,
                user,
                firebaseAuth
            }}>
            {props.children}
        </FirebaseContext.Provider>
    )
}