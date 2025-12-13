import { createContext, useEffect, useState } from "react";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance.js";

// UserProvider.jsx

// ... imports

export const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Keep this as true

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("TOKEN FROM LS:", token);

    if (!token) {
      // If NO token, stop IMMEDIATELY and set loading to false.
      // This ensures the PrivateRoute logic runs quickly for unauthenticated users.
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        // ... API call remains the same
        const res = await axiosInstance.get(API_PATHS.AUTH.PROFILE);
        setUser(res.data.user);
      } catch (error) {
        // If API fails, clear user and token.
        console.log("PROFILE ERROR:", error.response?.status, error.message);
        clearUser(); // This clears the token and sets user to null
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  // ... rest of the component

  const updateUser = (data) => {
    setUser({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      image: data.user.image,
      isAdmin: data.user.isAdmin,
    });

    localStorage.setItem("token", data.token);
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
