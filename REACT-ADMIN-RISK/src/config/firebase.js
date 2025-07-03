// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDvqjdSElZ_sNdfZ1DdIMqDU2lP1IkAVNM",
    authDomain: "fir-fdcad.firebaseapp.com",
    projectId: "fir-fdcad",
    storageBucket: "fir-fdcad.appspot.com",
    messagingSenderId: "1059227061691",
    appId: "1:1059227061691:web:afe775033c77b2f112889e",
    measurementId: "G-DC1WDVJ2K1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { app, analytics, storage };