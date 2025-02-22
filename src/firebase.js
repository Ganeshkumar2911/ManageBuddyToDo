import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
        apiKey: "AIzaSyC4AJCGhX9Hv4FTqn78jrvoWPitYnRc-XY",
    authDomain: "login-todo-54990.firebaseapp.com",
    projectId: "login-todo-54990",
    storageBucket: "login-todo-54990.firebasestorage.app",
    messagingSenderId: "233059662654",
    appId: "1:233059662654:web:c8a5b5c90ff63ca2670a6f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth , db};