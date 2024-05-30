import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { ForgotPass, Response, SignUp } from "./libraryType/type";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDZ4OnCgIJmfbD5e68xLndPzDMk9lEsd3s",
  authDomain: "hcmutassignment.firebaseapp.com",
  projectId: "hcmutassignment",
  storageBucket: "hcmutassignment.appspot.com",
  messagingSenderId: "974473698245",
  appId: "1:974473698245:web:ae076a183c7c35095549ac",
};

firebase.initializeApp(firebaseConfig);

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage();
const firestore = firebase.firestore();

export class UsersOperation {
  constructor() { }

  async handleAuth() {
    let result: Response = { error: true, data: null };

    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result2 = await signInWithPopup(auth, provider);
      const user = result2.user;

      if (result2) {
        const docRef = doc(db, "users", user.uid);
        await setDoc(
          docRef,
          {
            email: user.email,
            timestamp: serverTimestamp(),
            profilePicture: user.photoURL,
          },
          { merge: true }
        );

        result.error = false;
        result.data = user;
      }
      return result;
    } catch (error) {
      return result;
    }
  }

  async handleSignUp(userAccount: SignUp) {
    let result: Response = { error: true, data: undefined };

    if (userAccount.password.length < 8) {
      return result;
    }

    try {
      const auth = getAuth();
      const response = await createUserWithEmailAndPassword(
        auth,
        userAccount.email,
        userAccount.password
      );

      if (response) {
        result.error = false;
        result.data = response;
        const user = response.user;
        const docRef = doc(db, "users", user.uid);
        await setDoc(
          docRef,
          {
            email: user.email,
            timestamp: serverTimestamp(),
            profilePicture: user.photoURL,
          },
          { merge: true }
        );
      }
      return result;
    } catch (error) {
      return result;
    }
  }

  async handleSignIn(userAccount: SignUp) {
    let result: Response = { error: true, data: null };

    try {
      const auth = getAuth();
      const response = await signInWithEmailAndPassword(
        auth,
        userAccount.email,
        userAccount.password
      );

      if (response) {
        result.error = false;
        result.data = response;
      }
      return result;
    } catch (error) {
      return result;
    }
  }

  async handleGetUserProfilePicture(): Promise<string | null> {
    const auth = getAuth();

    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data && data.profilePicture) {
                resolve(data.profilePicture);
              }
            }
          } catch (error) {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    });
  }

  async getUserEmail(): Promise<string | null> {
    const auth = getAuth();

    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data && data.email) {
                resolve(data.email);
              }
            }
          } catch (error) {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    });
  }

  async onClickLogOut() {
    const auth = getAuth();
    auth.signOut();
  }

  async checkUserLoggedIn() {
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  async handleForgotPass(userAccount: ForgotPass) {
    let result: Response = { error: true, data: undefined };

    try {
      const auth = getAuth();
      const response = await sendPasswordResetEmail(auth, userAccount.email);
      result.error = false;
      result.data = response;
      return result;
    } catch (error) {
      return result;
    }
  }
}
