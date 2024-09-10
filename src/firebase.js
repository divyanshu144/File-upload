// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbao3a9TbFu-mRc5e3VcrDe5Od8NfsRIA",
  authDomain: "upload-filie.firebaseapp.com",
  projectId: "upload-filie",
  storageBucket: "upload-filie.appspot.com",
  messagingSenderId: "658257092256",
  appId: "1:658257092256:web:a4ae4aef695c7634faf3c5",
  measurementId: "G-8T8HBR51Q8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage};