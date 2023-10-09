// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiGqvMJycUu5i9y5N8E-M_IknGImIKjac",
  authDomain: "qlphongtro-8088a.firebaseapp.com",
  projectId: "qlphongtro-8088a",
  storageBucket: "qlphongtro-8088a.appspot.com",
  messagingSenderId: "342541146137",
  appId: "1:342541146137:web:95f5f1163a66de7d833288",
  measurementId: "G-HLSME0YZ58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db