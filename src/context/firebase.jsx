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
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteField, addDoc, collection, arrayUnion, getDocs, Timestamp, arrayRemove, deleteDoc, query, where } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

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

            const userDocRef = doc(firestore, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                // The user is signing up for the first time
                await setDoc(userDocRef, {
                    photoURL: user.photoURL ? user.photoURL.replace(/=s\d+/, "=s720") : null,
                    fullName: user.displayName,
                    email: user.email,
                });
            }
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

    // Upload image to cloudinary
    const uploadImage = async (photo) => {
        const data = new FormData();
        data.append("file", photo);
        data.append("upload_preset", "Togatherable");
        data.append("cloud_name", "dlwudcsu1");
        try {
            const uploadResult = await fetch('https://api.cloudinary.com/v1_1/dlwudcsu1/image/upload', {
                method: "POST",
                body: data
            });
            const result = await uploadResult.json();
            return result.url;
        } catch (error) {
            console.log("Failed to upload to cloudinary!!")
        }
    }

    // Method for creating community
    const createCommunity = async (data) => {
        try {
            const communityRef = await addDoc(collection(firestore, 'communities'), {
                ...data,
                members: [user.uid],
                createdBy: user.uid,
            });
            await setDoc(doc(firestore, 'users', user.uid), {
                joinedCommunities: arrayUnion(communityRef.id)
            }, { merge: true });
            location.reload();
        } catch (error) {
            console.log("Failed to create community!!", error)
        }
    }

    // Method for deleting a community
    const deleteCommunity = async (communityId, userId) => {
        try {
            await deleteDoc(doc(firestore, 'communities', communityId));
            const users = await getDocs(collection(firestore, 'users'));
            users.forEach(async (userDocs) => {
                await updateDoc(doc(firestore, 'users', userDocs.id), {
                    joinedCommunities: arrayRemove(communityId)
                });
            });
        } catch (error) {
            console.log("Failed to delete community!!")
        }
    }

    // Method for fetching all communities
    const fetchCommunities = async () => {
        try {
            const communities = await getDocs(collection(firestore, 'communities'));
            return communities.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (error) {
            console.log("Failed to fetch communities!!");
        }
    }

    // Method for fetching all joined communities
    const fetchJoinedCommunities = async (userId) => {
        try {
            const snapshot = await getDocs(
                query(collection(firestore, 'communities'), where('members', 'array-contains', userId))
            );
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Failed to fetch communities!", error);
            return [];
        }
    };

    // Method for getting user by id
    const getUser = async (id) => {
        try {
            const userDoc = await getDoc(doc(firestore, "users", id));
            if (userDoc.exists()) {
                return userDoc.data();
            } else {
                console.log("User not found!");
                return null;
            }
        } catch (error) {
            console.log("Failed to find user:", error);
            return null;
        }
    }

    // Method for creating post in community 
    const createPost = async (communityId, data) => {
        try {
            const post = {
                id: uuidv4(),
                ...data,
                postedBy: user.uid,
                timestamp: new Date().toISOString(),
            }
            await updateDoc(doc(firestore, 'communities', communityId), {
                posts: arrayUnion(post),
            });
            location.reload();
        } catch (error) {
            console.log("Failed to create post !!", error)
        }
    }

    const deletePost = async (communityId, postId) => {
        try {
            const communityRef = doc(firestore, 'communities', communityId);
            const communitySnap = await getDoc(communityRef);
            if (communitySnap.exists()) {
                const posts = communitySnap.data().posts || [];
                const updatedPosts = posts.filter(post => post.id !== postId);
                await updateDoc(communityRef, { posts: updatedPosts });
                location.reload();
            }
        } catch (error) {
            console.log("Failed to delete post !!", error);
        }
    };

    // Method for getting all posts in community 
    const fetchPosts = async (communityId) => {
        try {
            const community = await getDoc(doc(firestore, 'communities', communityId))
            if (community.exists()) {
                return community.data();
            }
        } catch (error) {
            console.log("Failed to fetch posts !!", error)
        }
    }

    // Method for joining a commuunity 
    const joinCommuniy = async (communityId, userId) => {
        try {
            await updateDoc(doc(firestore, "communities", communityId), {
                members: arrayUnion(userId),
            })
            await updateDoc(doc(firestore, 'users', userId), {
                joinedCommunities: arrayUnion(communityId)
            })
            location.reload();
        } catch (error) {
            console.log("Failed to join community!!", error)
        }
    }

    // Method for leaving a commuunity 
    const leaveCommuniy = async (communityId, userId) => {
        try {
            await updateDoc(doc(firestore, "communities", communityId), {
                members: arrayRemove(userId),
            })
            await updateDoc(doc(firestore, 'users', userId), {
                joinedCommunities: arrayRemove(communityId)
            })
            location.reload();
        } catch (error) {
            console.log("Failed to join community!!", error)
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
                uploadImage,
                createCommunity,
                deleteCommunity,
                fetchCommunities,
                getUser,
                createPost,
                deletePost,
                fetchPosts,
                joinCommuniy,
                leaveCommuniy,
                fetchJoinedCommunities,
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
