import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UseContext";

function PrivateRoute({ isAdminOnly = false }) {
  const { user, loading } = useContext(UserContext);

console.log("PRIVATE ROUTE:", { user, loading });


  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (isAdminOnly && !user.isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
