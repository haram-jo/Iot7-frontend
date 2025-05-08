import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCiorzdOWoeLPptWAV7xm56TmdN8lLqL4c',
  authDomain: 'iot7-435d1.firebaseapp.com',
  projectId: 'iot7-435d1',
  storageBucket: 'iot7-435d1.appspot.com',
  messagingSenderId: '981339430588',
  appId: '1:981339430588:web:7b265ed5b76d038c7afab9',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);



export {app, auth};
