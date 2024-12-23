import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Firestore imports

const firebaseConfig = {
    apiKey: "AIzaSyBR0he9feN636824JXry5H6vzUK5CSeDmI",
    authDomain: "sample-app-b0863.firebaseapp.com",
    projectId: "sample-app-b0863",
    storageBucket: "sample-app-b0863.firebasestorage.app",
    messagingSenderId: "185289007087",
    appId: "1:185289007087:web:b3c5646be3dd2fa0eae01a",
};
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
firebaseAuth.languageCode = 'en';
const firestore = getFirestore(firebaseApp);
const provider = new GoogleAuthProvider();

const FirebaseContext = createContext(null);

export const useFirebase = () => {
    return useContext(FirebaseContext);
};

export const FirebaseProvider = (props) => {

    // Methood for signup
    const signupWithEmailAndPassword = async (email, password, additionalData) => {
        return createUserWithEmailAndPassword(firebaseAuth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                // Save additional user data to Firestore
                await setDoc(doc(firestore, "users", user.uid), {
                    email: user.email,
                    ...additionalData
                });
            });
    };

    // Method for login
    const signinWithEmailAndPassword = (email, password) => {
        return signInWithEmailAndPassword(firebaseAuth, email, password);
    };

    // Method for login with google
    const continueWithGoogle = () => {
        signInWithPopup(firebaseAuth, provider)
            .then((result) => {
                const user = result.user;
                // Save additional user data to Firestore if needed
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const [user, setUser] = useState(null);
    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
    }, []);

    return (
        <FirebaseContext.Provider
            value={{
                signupWithEmailAndPassword,
                signinWithEmailAndPassword,
                continueWithGoogle,
                user,
                firebaseAuth
            }}>
            {props.children}
        </FirebaseContext.Provider>
    );
};
