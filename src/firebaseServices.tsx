// src/services/firebaseService.ts
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase"; // Ensure this path is correct

// Define the BorrowRecord interface
export interface BorrowRecord {
  id: string;
  fullName: string;
  itemName: string;
  assetTag: string;
  dateBorrowed: string;
  daysBorrowed: number;
  reason: string;
  status: "Borrowed" | "Overdue" | "Returned";
  dateToBeReturned: string;
  dateReturned: string;
}

// Fetch all records from Firestore
export const fetchRecords = async (): Promise<BorrowRecord[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "borrowRecords"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BorrowRecord[];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Add a new record to Firestore
export const addRecord = async (newEntry: Omit<BorrowRecord, "id">): Promise<BorrowRecord> => {
  try {
    const docRef = await addDoc(collection(db, "borrowRecords"), newEntry);
    return { id: docRef.id, ...newEntry };
  } catch (error) {
    console.error("Error adding entry:", error);
    throw error;
  }
};

// Delete a record from Firestore
export const deleteRecord = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "borrowRecords", id));
  } catch (error) {
    console.error("Error deleting record:", error);
    throw error;
  }
};

// Update a record in Firestore
export const updateRecord = async (id: string, updatedData: Partial<BorrowRecord>): Promise<void> => {
  try {
    const recordRef = doc(db, "borrowRecords", id);
    await updateDoc(recordRef, updatedData);
  } catch (error) {
    console.error("Error updating record:", error);
    throw error;
  }
};