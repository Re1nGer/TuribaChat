import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import { getStorage, ref } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBjUOTa3AkgrjAD6l6Cj70ySecy8lfBka0",
  authDomain: "turibachatapp.firebaseapp.com",
  databaseURL: "https://turibachatapp-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "turibachatapp",
  storageBucket: "turibachatapp.appspot.com",
  messagingSenderId: "923258491440",
  appId: "1:923258491440:web:5b84e3320085b8da9a13f5",
  measurementId: "G-MMLT3SS95M"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth();

export const db = getFirestore(app);

const storage = getStorage();

export const storageRef = ref(storage);

const provider = new GoogleAuthProvider();

const gitProvider = new GithubAuthProvider();

export const signInWithGoogle = async () => {

  try {
    const request = await signInWithPopup(auth, provider);
    const { user } = request;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        photoUrl: user.photoURL
      });
    }
  } catch(error) {
    console.log(error);
  } 
}


export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, gitProvider)
    const user = result.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
     if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "github",
        email: user.email,
        photoUrl: user.photoURL
      })
    }
  }
    // ...
  catch(error) {
    // Handle Errors here.
    console.log(error);
  };
}