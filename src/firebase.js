require('dotenv').config();

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getDatabase } from "firebase/database"; // If using Firebase Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app); // Initialize if using Firebase Realtime Database

// Function to create a user with email and password
async function createUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created:", userCredential.user);
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

// Function to add a document to "users" collection
async function addUserDoc(uid, name, email, role) {
  try {
    await addDoc(collection(db, "users"), {
      uid,
      name,
      email,
      role,
    });
    console.log("Document added to users collection");
  } catch (error) {
    console.error("Error adding document:", error);
  }
}

// Function to update a user document
async function updateUserDoc(docId, updatedData) {
  try {
    const docRef = doc(db, "users", docId);
    await updateDoc(docRef, updatedData);
    console.log("Document updated");
  } catch (error) {
    console.error("Error updating document:", error);
  }
}

// Function to delete a user document
async function deleteUserDoc(docId) {
  try {
    const docRef = doc(db, "users", docId);
    await deleteDoc(docRef);
    console.log("Document deleted");
  } catch (error) {
    console.error("Error deleting document:", error);
  }
}

// Function to get all documents from "users" collection
async function getAllUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error("Error getting documents:", error);
    return [];
  }
}

// Function to update a user role
async function updateUserRole(userId, newRole) {
  try {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, { role: newRole });
    console.log("User role updated");
  } catch (error) {
    console.error("Error updating user role:", error);
  }
}

// Placeholder function for sending training invites
async function sendTrainingInvite(userIds, trainingId) {
  console.log(`Sending training invites to users: ${userIds} for training: ${trainingId}`);
  // Implement your logic here
}

// Placeholder function for importing users from CSV
async function importUsersFromCsv(file) {
  console.log(`Importing users from CSV: ${file.name}`);
  // Implement your logic here
}

// Placeholder function for getting trainings
async function getTrainings() {
  console.log("Fetching all trainings...");
  // Implement your logic here
}

// Exporting functionalities
export {
  auth,
  db,
  database, // Export if you plan to use Firebase Realtime Database
  createUser,
  addUserDoc,
  updateUserDoc,
  deleteUserDoc,
  getAllUsers,
  sendTrainingInvite,
  importUsersFromCsv,
  getTrainings,
  getUsers, // Add getUsers to exports
  updateUserRole, // Add updateUserRole to exports
};
