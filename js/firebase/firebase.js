// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAhWGwX-EPS0M3YlpWJngFydRXICO3n28w",
    authDomain: "aplicaciones-mdlg.firebaseapp.com",
    databaseURL: "https://aplicaciones-mdlg-default-rtdb.firebaseio.com",
    projectId: "aplicaciones-mdlg",
    storageBucket: "aplicaciones-mdlg.firebasestorage.app",
    messagingSenderId: "660506051251",
    appId: "1:660506051251:web:274afe37bed3e88b65e6c6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)