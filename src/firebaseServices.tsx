// src/services/firebaseService.ts
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase"; // Ensure this path is correct
import { toast } from "react-hot-toast";

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
    const records = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BorrowRecord[];
    return records;
  } catch (error) {
    console.error("Error fetching data:", error);
    toast.error("Failed to fetch records");
    throw error;
  }
};

// Add a new record to Firestore
export const addRecord = async (newEntry: Omit<BorrowRecord, "id">): Promise<BorrowRecord> => {
  try {
    const docRef = await addDoc(collection(db, "borrowRecords"), newEntry);
    const addedRecord = { id: docRef.id, ...newEntry };
    toast.success("Record added successfully!");
    return addedRecord;
  } catch (error) {
    console.error("Error adding entry:", error);
    toast.error("Failed to add record");
    throw error;
  }
};

// Delete a record from Firestore
export const deleteRecord = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "borrowRecords", id));
    toast.success("Record deleted successfully!");
  } catch (error) {
    console.error("Error deleting record:", error);
    toast.error("Failed to delete record");
    throw error;
  }
};

// Update a record in Firestore
export const updateRecord = async (id: string, updatedData: Partial<BorrowRecord>): Promise<void> => {
  try {
    const recordRef = doc(db, "borrowRecords", id);
    await updateDoc(recordRef, updatedData);
    toast.success("Record updated successfully!");
  } catch (error) {
    console.error("Error updating record:", error);
    toast.error("Failed to update record");
    throw error;
  }
};

// Fetch items from Firestore
export const fetchItems = async (): Promise<string[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "items"));
    const items = querySnapshot.docs.map((doc) => doc.data().name);
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    toast.error("Failed to fetch items");
    throw error;
  }
};

// Add a new item to Firestore
export const addItem = async (itemName: string): Promise<void> => {
  try {
    await addDoc(collection(db, "items"), { name: itemName });
    toast.success("Item added successfully!");
  } catch (error) {
    console.error("Error adding item:", error);
    toast.error("Failed to add item");
    throw error;
  }
};


// Delete an item from Firestore
export const deleteItem = async (itemName: string): Promise<void> => {
  try {
    // Fetch the document ID for the item
    const querySnapshot = await getDocs(collection(db, "items"));
    const itemDoc = querySnapshot.docs.find((doc) => doc.data().name === itemName);

    if (itemDoc) {
      // Delete the document
      await deleteDoc(doc(db, "items", itemDoc.id));
    } else {
      throw new Error("Item not found");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};