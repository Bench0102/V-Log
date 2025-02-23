import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { app } from "../firebase"; // Adjust the path to your firebase.ts file

const auth = getAuth(app);

const ProtectedRoute: React.FC = () => {
  const user = auth.currentUser; // Check if the user is authenticated

  if (!user) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/" />;
  }

  // If the user is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;