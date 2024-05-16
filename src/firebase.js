require('dotenv').config();

// Importeer de functies die je nodig hebt uit de SDK's die je nodig hebt
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
import { getDatabase } from "firebase/database"; // Als je Firebase Realtime Database gebruikt

// Jouw Firebase-configuratie voor de webapplicatie
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialiseer Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app); // Initialiseer als je Firebase Realtime Database gebruikt

// Functie om een gebruiker aan te maken met e-mail en wachtwoord
async function createUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Gebruiker aangemaakt:", userCredential.user);
  } catch (error) {
    console.error("Fout bij het maken van gebruiker:", error);
  }
}

// Functie om een document toe te voegen aan de "users"-collectie
async function addUserDoc(uid, name, email, role) {
  try {
    await addDoc(collection(db, "users"), {
      uid,
      name,
      email,
      role,
    });
    console.log("Document toegevoegd aan gebruikerscollectie");
  } catch (error) {
    console.error("Fout bij het toevoegen van document:", error);
  }
}

// Functie om een gebruikersdocument bij te werken
async function updateUserDoc(docId, updatedData) {
  try {
    const docRef = doc(db, "users", docId);
    await updateDoc(docRef, updatedData);
    console.log("Document bijgewerkt");
  } catch (error) {
    console.error("Fout bij het bijwerken van document:", error);
  }
}

// Functie om een gebruikersdocument te verwijderen
async function deleteUserDoc(docId) {
  try {
    const docRef = doc(db, "users", docId);
    await deleteDoc(docRef);
    console.log("Document verwijderd");
  } catch (error) {
    console.error("Fout bij het verwijderen van document:", error);
  }
}

// Functie om alle documenten uit de "users"-collectie te krijgen
async function getAllUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
  } catch (error) {
    console.error("Fout bij het ophalen van documenten:", error);
  }
}

// Placeholder functie voor het verzenden van uitnodigingen voor trainingen
async function sendTrainingInvite(userIds, trainingId) {
  console.log(`Sturen van traininguitnodigingen naar gebruikers: ${userIds} voor training: ${trainingId}`);
  // Implementeer hier je logica
}

// Placeholder functie voor het importeren van gebruikers uit CSV
async function importUsersFromCsv(file) {
  console.log(`Importeren van gebruikers uit CSV: ${file.name}`);
  // Implementeer hier je logica
}

// Placeholder functie voor het ophalen van trainingen
async function getTrainings() {
  console.log("Ophalen van alle trainingen...");
  // Implementeer hier je logica
}

// Exporteren van functionaliteiten
export {
  auth,
  db,
  database, // Exporteren als je van plan bent Firebase Realtime Database te gebruiken
  createUser,
  addUserDoc,
  updateUserDoc,
  deleteUserDoc,
  getAllUsers,
  sendTrainingInvite,
  importUsersFromCsv,
  getTrainings,
};
