import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);
const functions = getFunctions(app);
const googleProvider = new GoogleAuthProvider();


// Admin

// Admin Login page

// Users

const createUser = async (name, email, role) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, 'password');
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

      // Send email invite to user
      // ...

      console.log(`Invite with ID ${inviteRef.id} sent to ${userData.email}`);
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// Trainings

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
    await updateDoc(trainingRef, {
      name,
      questions,
    });
    console.log(`Training ${name} updated with ID ${trainingRef.id}`);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const deleteTraining = async (trainingId) => {
  try {
    const trainingRef = doc(db, "trainings", trainingId);
    await deleteDoc(trainingRef);
    console.log(`Training with ID ${trainingRef.id} deleted`);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const getTrainings = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "trainings"));
    const trainings = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      trainings.push({
        id: doc.id,
        name: data.name,
        questions: data.questions,
        validityPeriodSeconds: data.validityPeriodSeconds,
      });
    });
    return trainings;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const getTrainingById = async (trainingId) => {
  try {
    const trainingRef = doc(db, "trainings", trainingId);
    const trainingSnapshot = await getDoc(trainingRef);
    if (!trainingSnapshot.exists()) {
      throw new Error(`Training with ID ${trainingId} does not exist`);
    }
    const trainingData = trainingSnapshot.data();
    return {
      id: trainingSnapshot.id,
      name: trainingData.name,
      questions: trainingData.questions,
      validityPeriodSeconds: trainingData.validityPeriodSeconds,
    };
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = async () => {
  try {
    await auth.signOut();
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error);
  }
}
export const getUsers = async () => {
  const snapshot = await db.collection('users').get();
  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return users;
};

const importUsersFromCsv = async (file) => {
  try {
    const fileReader = new FileReader();
    fileReader.readAsText(file);

    fileReader.onload = async (e) => {
      const users = [];
      const rows = e.target.result.split("\n");
      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].split(",");
        const name = cells[0].trim();
        const email = cells[1].trim();
        const role = cells[2].trim();
        users.push({ name, email, role });
      }
      await Promise.all(
        users.map(async ({ name, email, role }) => {
          const existingUser = await db
            .collection("users")
            .where("email", "==", email)
            .get();
          if (existingUser.docs.length > 0) {
            return;
          }
          await db.collection("users").add({
            name,
            email,
            role,
          });
        })
      );
    };
  } catch (error) {
    console.error(error);
  }
};


export {
  importUsersFromCsv,
  auth,
  db,
  database,
  googleProvider,
  logout,
  createUser,
  updateUserRole,
  deleteUser,
  sendTrainingInvite,
  createTraining,
  updateTraining,
  deleteTraining,
  getTrainings,
  getTrainingById,
};

export default firebase;
