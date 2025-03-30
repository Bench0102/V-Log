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

export const deleteUserAccount = async (user: User): Promise<void> => {
  try {
    // Ensure the user is authenticated
    if (!auth.currentUser) {
      throw new Error("User is not authenticated.");
    }

    // Delete user from Firestore
    const userDocs = await getDocs(collection(db, "users"));
    userDocs.forEach(async (doc: QueryDocumentSnapshot<DocumentData>) => {
      if (doc.data().uid === user.uid) {
        await deleteDoc(doc.ref);
        console.log("User deleted from Firestore:", user.uid); // Debugging
      }
    });

    // Delete user from Firebase Authentication
    await deleteUser(user);
    console.log("User deleted from Firebase Authentication:", user.uid); // Debugging
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