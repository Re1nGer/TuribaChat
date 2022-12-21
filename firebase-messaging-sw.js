import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

const firebaseConfig = initializeApp({
  apiKey: "AIzaSyBjUOTa3AkgrjAD6l6Cj70ySecy8lfBka0",
  authDomain: "turibachatapp.firebaseapp.com",
  databaseURL: "https://turibachatapp-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "turibachatapp",
  storageBucket: "turibachatapp.appspot.com",
  messagingSenderId: "923258491440",
  appId: "1:923258491440:web:5b84e3320085b8da9a13f5",
  measurementId: "G-MMLT3SS95M"
});

const messaging = getMessaging(firebaseConfig);