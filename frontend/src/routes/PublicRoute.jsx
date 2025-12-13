// ./routes/PublicRoute.jsx

import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UseContext.jsx";


// Safest version of PublicRoute to prevent crashes:
function PublicRoute() {
  const { user, loading } = useContext(UserContext);

  if (loading) return <div>Loading...</div>; // 1. Always wait for loading

  if (user) { 
    // 2. Only check isAdmin property if user object is CONFIRMED to exist
    if (user.isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/home" replace />; 
  }

  return <Outlet />; // 3. Render public content if not loading and not logged in
}

export default PublicRoute;