import React, { createContext, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths";

export const UserContext = createContext();  

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");

    if (!accessToken) {
      setLoading(false);
      console.log("NO access token")
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.AUTH.PROFILE);
        // console.log("Profile:",res.data.data);
        setUser(res.data.data); 
      } catch (error) {
          console.log("storing error:",error)
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = (userData) => {
    setUser(userData.user);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("userId",userData.user.id);
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
