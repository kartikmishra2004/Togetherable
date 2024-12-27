import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteField } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBR0he9feN636824JXry5H6vzUK5CSeDmI",
    authDomain: "sample-app-b0863.firebaseapp.com",
    projectId: "sample-app-b0863",
    storageBucket: "sample-app-b0863.firebasestorage.app",
    messagingSenderId: "185289007087",
    appId: "1:185289007087:web:b3c5646be3dd2fa0eae01a",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
firebaseAuth.languageCode = "en";
const firestore = getFirestore(firebaseApp);
const provider = new GoogleAuthProvider();

// Create context
const FirebaseContext = createContext(null);

// Hook to access context
export const useFirebase = () => {
    return useContext(FirebaseContext);
};

// Firebase Provider
export const FirebaseProvider = (props) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to fetch user data from Firestore
    const fetchUserData = async (uid) => {
        try {
            const userDocRef = doc(firestore, "users", uid);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // Handle auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            if (user) {
                setUser(user);
                await fetchUserData(user.uid);
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Method for signup
    const signupWithEmailAndPassword = async (email, password, additionalData) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            const user = userCredential.user;
            // Save additional user data to Firestore
            await setDoc(doc(firestore, "users", user.uid), {
                email: user.email,
                ...additionalData,
            });
        } catch (error) {
            console.error("Error during signup:", error);
            throw error;
        }
    };

    // Method for login
    const signinWithEmailAndPassword = async (email, password) => {
        try {
            return await signInWithEmailAndPassword(firebaseAuth, email, password);
        } catch (error) {
            console.error("Error during signin:", error);
            throw error;
        }
    };

    // Method for login with Google
    const continueWithGoogle = async () => {
        try {
            const result = await signInWithPopup(firebaseAuth, provider);
            const user = result.user;
            await setDoc(doc(firestore, "users", user.uid), {
                photoURL: user.photoURL ? user.photoURL.replace(/=s\d+/, "=s720") : null,
                fullName: user.displayName,
                email: user.email,
            },
                { merge: true });
        } catch (error) {
            console.error("Error during Google login:", error);
        }
    };

    // Logout method
    const logout = async () => {
        try {
            await firebaseAuth.signOut();
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    // saving location
    const putLocation = async (location) => {
        if (!user?.uid) {
            console.log("User not authenticated!");
            return;
        }
        try {
            await updateDoc(doc(firestore, "users", user.uid), {
                location: location,
            });
        } catch (error) {
            console.error("Failed to save location:", error);
        }
    };

    // Deleting location
    const deleteLocation = async () => {
        if (!user?.uid) {
            console.log("User not authenticated!");
            return;
        }
        try {
            await updateDoc(doc(firestore, "users", user.uid), {
                location: deleteField(),
            });
        } catch (error) {
            console.error("Failed to save location:", error);
        }
    };

    // Edit / complete profile
    const updateProfile = async (updatedData) => {
        if (!user?.uid) {
            console.log("User not authenticated!");
            return;
        }
        try {
            await setDoc(doc(firestore, "users", user.uid), updatedData,
                { merge: true });

            location.reload();
        } catch (error) {
            console.log("Failed to update profile")
        }
    }

    return (
        <FirebaseContext.Provider
            value={{
                signupWithEmailAndPassword,
                signinWithEmailAndPassword,
                continueWithGoogle,
                logout,
                putLocation,
                deleteLocation,
                updateProfile,
                user,
                userData,
                loading,
                firebaseAuth,
                firestore,
            }}
        >
            {props.children}
        </FirebaseContext.Provider>
    );
};
