import { auth } from "./firebase";
import { createUserWithEmailAndPassword, deleteUser, User } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const addUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

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

export const deleteUserAccount = async (userId: string): Promise<void> => {
  try {
    // Step 1: Delete user from Firestore first
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);

    let userDocRef = null;
    querySnapshot.forEach((doc) => {
      if (doc.data().uid === userId) {
        userDocRef = doc.ref;
      }
    });

    if (userDocRef) {
      await deleteDoc(userDocRef);
      console.log("User deleted from Firestore:", userId);
    } else {
      console.warn("User not found in Firestore:", userId);
    }

    // Step 2: Delete user from Firebase Authentication (only if it's the logged-in user)
    if (auth.currentUser?.uid === userId) {
      await deleteUser(auth.currentUser);
      console.log("User deleted from Firebase Authentication:", userId);
    }

  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};


export const fetchUsers = async (): Promise<UserProfile[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map((doc) => doc.data() as UserProfile);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};