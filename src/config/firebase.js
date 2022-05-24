import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBMGqxoAj906qLLYc0JMdzIzndf9ZqdJcM',
  authDomain: 'crshopping-341ab.firebaseapp.com',
  projectId: 'crshopping-341ab',
  storageBucket: 'crshopping-341ab.appspot.com',
  messagingSenderId: '276430300241',
  appId: '1:276430300241:web:ea0da6f55e66d95fbe8470',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firestore = getFirestore()
const storage = getStorage(app)

export { firestore, storage }
