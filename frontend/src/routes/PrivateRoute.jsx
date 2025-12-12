import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UseContext";

function PrivateRoute({ isAdminOnly = false }) {
  const { user, loading } = useContext(UserContext);

  // console.log(user);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (isAdminOnly && !user.isAdmin) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
}

export default PrivateRoute;
