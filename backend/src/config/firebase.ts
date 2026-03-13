import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let firebaseInitialized = false;

export const initializeFirebase = () => {
  if (firebaseInitialized) {
    return admin.firestore();
  }

  try {
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      throw new Error(
        'Firebase credentials not found. Please set up your .env file.'
      );
    }

    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized successfully');
    return admin.firestore();
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error);
    throw error;
  }
};

export const getFirestore = () => {
  return admin.firestore();
};
