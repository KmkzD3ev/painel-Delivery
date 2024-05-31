import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword ,signOut} from "firebase/auth";









const firebaseConfig = {
    apiKey: "AIzaSyDKq9_KpE4ex1c2yhUczApUk1x0Qf_JnbI",
    authDomain: "deliveryapp-a2882.firebaseapp.com",
    projectId: "deliveryapp-a2882",
    storageBucket: "deliveryapp-a2882.appspot.com",
    messagingSenderId: "783501334189",
    appId: "1:783501334189:web:0887d2ca88626096b51824",
    measurementId: "G-ZTYPP9DR38"
  };

  const firebaseapp = initializeApp(firebaseConfig);

  const db =  getFirestore(firebaseapp)

  const auth = getAuth(firebaseapp)

  const  storage = getStorage(firebaseapp)

  export {db,auth,storage,signInWithEmailAndPassword,signOut};