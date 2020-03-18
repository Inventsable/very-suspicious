import firebase from 'firebase/app'
import firestore from 'firebase/firestore'

var config = {
    apiKey: process.env.apiKey,
    authDomain: "very-suspicious.firebaseapp.com",
    databaseURL: "https://very-suspicious.firebaseio.com",
    projectId: "very-suspicious",
    storageBucket: "",
    messagingSenderId: "1403919471"
};

const firebaseApp = firebase.initializeApp(config);

export default firebaseApp.firestore();