import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, addDoc, doc, updateDoc, deleteDoc, getDocs, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const createUser = async (name, email, role) => {
  try {
    const res = await auth.createUserWithEmailAndPassword(email, 'password');
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      role,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const updateUserRole = async (userId, role) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendTrainingInvite = async (userIds, trainingId) => {
  try {
    const trainingRef = doc(db, 'trainings', trainingId);
    const trainingSnapshot = await getDocs(trainingRef);

    if (!trainingSnapshot.exists()) {
      throw new Error(`Training with ID ${trainingId} does not exist`);
    }

    const trainingData = trainingSnapshot.data();
    const validUntil = Date.now() + (trainingData.validityPeriodSeconds * 1000);

    for (const userId of userIds) {
      const userRef = doc(db, 'users', userId);
      const userSnapshot = await getDocs(userRef);

      if (!userSnapshot.exists()) {
        throw new Error(`User with ID ${userId} does not exist`);
      }

      const userData = userSnapshot.data();

      const inviteRef = await addDoc(collection(db, 'invites'), {
        userId,
        trainingId,
        validUntil,
      });

      console.log(`Invite with ID ${inviteRef.id} sent to ${userData.email}`);
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const createTraining = async (name, questions) => {
  try {
    const trainingRef = await addDoc(collection(db, "trainings"), {
      name,
      questions,
      validityPeriodSeconds: 604800, // 7 days
    });
    console.log(`Training ${name} created with ID ${trainingRef.id}`);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const updateTraining = async (trainingId, name, questions) => {
  try {
    const trainingRef = doc(db, "trainings", trainingId);
    const trainingSnapshot = await getDocs(trainingRef);

    if (!trainingSnapshot.exists()) {
      throw new Error(`Training with ID ${trainingId} does not exist`);
    }

    await updateDoc(trainingRef, { name, questions });
    console.log(`Training ${name} updated with ID ${trainingId}`);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const deleteTraining = async (trainingId) => {
  try {
    const trainingRef = doc(db, "trainings", trainingId);
    const trainingSnapshot = await getDocs(trainingRef);

    if (!trainingSnapshot.exists()) {
      throw new Error(`Training with ID ${trainingId} does not exist`);
    }

    await deleteDoc(trainingRef);
    console.log(`Training with ID ${trainingId} deleted`);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
export const getUsers = async () => {
  const users = [];
  const snapshot = await db.collection('users').get();
  snapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users;
};

export const getTrainings = async () => {
  try {
    const trainingsRef = collection(db, 'trainings');
    const trainingsSnapshot = await getDocs(trainingsRef);
    return trainingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export const importUsersFromCsv = async (file) => {
  try {
    const users = await csv().fromFile(file);
    const batch = db.batch();

    users.forEach(user => {
      const userRef = doc(db, 'users', user.uid);
      batch.set(userRef, user);
    });

    await batch.commit();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export {
  auth,
  db,
  googleProvider,
  createUser,
  updateUserRole,
  deleteUser,
  sendTrainingInvite,
  createTraining,
  updateTraining,
  deleteTraining,
};
