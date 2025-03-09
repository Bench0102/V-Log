import { auth } from "./firebase"; // Ensure this path is correct
import { createUserWithEmailAndPassword, deleteUser, User } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore"; // Import Firestore functions
import { db } from "./firebase"; // Import Firestore instance

// Define the UserProfile interface
export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Add a new user with email, password, and additional info
export const addUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<User> => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save additional user info to Firestore
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      email,
      firstName,
      lastName,
    });

    return user;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

// Delete a user from Firebase Authentication and Firestore
export const deleteUserAccount = async (user: User): Promise<void> => {
  try {
    // Delete user from Firestore
    const userDoc = await getDocs(collection(db, "users"));
    userDoc.forEach(async (doc: QueryDocumentSnapshot<DocumentData>) => {
      if (doc.data().uid === user.uid) {
        await deleteDoc(doc.ref);
      }
    });

    // Delete user from Firebase Authentication
    await deleteUser(user);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Fetch all users from Firestore
export const fetchUsers = async (): Promise<UserProfile[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map((doc) => doc.data() as UserProfile);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};