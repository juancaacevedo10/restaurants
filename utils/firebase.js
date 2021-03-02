import firebase from 'firebase/app'
import 'firebase/firestore'

 const firebaseConfig = {
    apiKey: "AIzaSyDFynPYJR_sYPxORYNWepdyjK0Oxm36vMg",
    authDomain: "restaurants-296c3.firebaseapp.com",
    projectId: "restaurants-296c3",
    storageBucket: "restaurants-296c3.appspot.com",
    messagingSenderId: "179512993914",
    appId: "1:179512993914:web:b575875d4134a05c7573c3"
  };


export const firebaseApp = firebase.initializeApp(firebaseConfig);
