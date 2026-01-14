// import { initializeApp, getApps } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
// };

// const app = getApps().length
//   ? getApps()[0]
//   : initializeApp(firebaseConfig);

// export const firebaseAuth = getAuth(app);
// export const firestore = getFirestore(app);




// config/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const firestore = getFirestore(app);
export default app;


{  /* 
  https://realestates-eec2e.firebaseapp.com/__/firebase/init.json 404 (Not Found)
l.send @ handler.js:192
(anonymous) @ handler.js:203
I @ handler.js:165
Vg.Ke @ handler.js:202
g @ handler.js:554
(anonymous) @ handler.js:555
a @ handler.js:164
(anonymous) @ handler.js:164
c @ handler.js:164
e.Pb @ handler.js:172
lg @ handler.js:175
hg @ handler.js:175
I.Zi @ handler.js:174
a @ handler.js:164
(anonymous) @ handler.js:164
c @ handler.js:164
Rf @ handler.js:165
a
Kf @ handler.js:165
cg @ handler.js:171
I.then @ handler.js:168
(anonymous) @ handler.js:555
a @ handler.js:164
(anonymous) @ handler.js:164
c @ handler.js:164
e.Pb @ handler.js:172
lg @ handler.js:175
hg @ handler.js:175
I.Zi @ handler.js:174
a @ handler.js:164
(anonymous) @ handler.js:164
c @ handler.js:164
Rf @ handler.js:165
a
Kf @ handler.js:165
cg @ handler.js:171
I.then @ handler.js:168
Zp.bb @ handler.js:553
Zp.start @ handler.js:552
jq @ handler.js:564
(anonymous) @ handler?apiKey=AIzaSyCP1VY4VmU5G9bSAWVGlB6OSGdgbuYwFMs&appName=%5BDEFAULT%5D&authType=signInViaRedirect&redirectUrl=http%3A%2F%2Flocalhost%3A3000%2Flogin&v=12.6.0&providerId=google.com&scopes=profile:10Understand this error
  
  */ }