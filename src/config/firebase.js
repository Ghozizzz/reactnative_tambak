import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2OZ9XPb0mBFWTouHMsPLEEinMYcbCrpc",
  authDomain: "tambak-72d23.firebaseapp.com",
  projectId: "tambak-72d23",
  storageBucket: "tambak-72d23.appspot.com",
  messagingSenderId: "41303691094",
  appId: "1:41303691094:web:8f4738e5445e1733e0d0f7"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); // if already initialized, use that one
}

const fr = firestore();
const db = firebase.firestore();

export {db, fr};