// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDQATwf7jcXEzfR1iRU06LtK2R0DbXMLxw',
  authDomain: 'ordering-merch.firebaseapp.com',
  projectId: 'ordering-merch',
  storageBucket: 'ordering-merch.firebasestorage.app',
  messagingSenderId: '107931327493',
  appId: '1:107931327493:web:f76f053489cd24c317506c',
  measurementId: 'G-0MV26BYBP2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
