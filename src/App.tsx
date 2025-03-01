import React, { useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase"; // Adjust the import path

import Login from "./pages/Login/login";
import Logspage from './pages/Logs/logsPage';
import ProtectedRoute from './Components/protectedRoute'; 
import Dashpage from "./pages/Dashboard/dashpage";

// Define your routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashpage" element={<Dashpage />} />
        <Route path="/logspage" element={<Logspage />} />
      </Route>
    </>
  )
);

const App: React.FC = () => {
  useEffect(() => {
    const auth = getAuth(app);

    // Sync authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        localStorage.setItem("authToken", user.uid); // Store UID as a token
      } else {
        // User is signed out
        localStorage.removeItem("authToken"); // Clear the token
      }
    });

    // Cleanup observer on unmount
    return () => unsubscribe();
  }, []);

  return (
    <RouterProvider router={router} />
  );
};

export default App;