// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBR0he9feN636824JXry5H6vzUK5CSeDmI",
  authDomain: "sample-app-b0863.firebaseapp.com",
  projectId: "sample-app-b0863",
  storageBucket: "sample-app-b0863.firebasestorage.app",
  messagingSenderId: "185289007087",
  appId: "1:185289007087:web:b3c5646be3dd2fa0eae01a",
  databaseURL: 'https://sample-app-b0863-default-rtdb.firebaseio.com/'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);