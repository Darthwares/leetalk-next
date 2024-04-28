// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxbSxSybAjEb-XThJ0VGrPKIq3x7LAuGs",
  authDomain: "leetalk-f904d.firebaseapp.com",
  projectId: "leetalk-f904d",
  storageBucket: "leetalk-f904d.appspot.com",
  messagingSenderId: "74156601832",
  appId: "1:74156601832:web:f49a80729085edacec345d",
  measurementId: "G-8BXXEPNBHH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);