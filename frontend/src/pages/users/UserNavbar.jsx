// import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_PATHS, BASE_URL } from "../../../utils/apiPaths";
// import axiosInstance from "../../../utils/axiosInstance";
import { SIDE_MENU_DATA_USER } from "../../../utils/data.js";
import { LogOut, Settings } from "lucide-react";
import { UserContext } from "../../context/UseContext.jsx";
import { useContext } from "react";

function UserNavbar() {
  const navigate = useNavigate();
  const location = useLocation(); // to highlight active path

   const userData = useContext(UserContext);
    const user = userData.user;
  // const [user, setUser] = useState({
  //   image: "",
  //   name: "",
  //   email: "",
  // });

  const data = [
    {
      id: "05",
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
    {
      id: "06",
      label: "Logout", // fixed typo
      icon: LogOut,
      path: "/",
    },
  ];

  // useEffect(() => {
  //   const getUserInfo = async () => {
  //     try {
  //       const res = await axiosInstance.get(API_PATHS.AUTH.PROFILE);
  //       if (res.data.success) {
  //         setUser({
  //           image: res.data.data.image,
  //           name: res.data.data.name,
  //           email: res.data.data.email,
  //         });
  //       } else {
  //         alert("error getting user info");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   getUserInfo();
  // }, []);

  return (
    
      <div className="w-64 border-r border-gray-700 flex flex-col">
        {/* User Info */}
        <div className="flex p-5 gap-4">
          <img
            className="w-16 h-16 rounded-full border border-white"
            src={`${BASE_URL}/uploads/${user.image}`}
            alt="user_img"
          />
          <div>
            <h1 className="font-bold text-white">{user.name}</h1>
            <h3 className="text-gray-300 font-light text-sm">{user.email}</h3>
          </div>
        </div>

        {/* Side Menu */}
        <div className="mt-10 flex flex-col">
          {SIDE_MENU_DATA_USER.map((item) => {
            const isActive = location.pathname === item.path; // highlight current page
            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 px-6 py-5 cursor-pointer rounded-sm transition-colors ${
                  isActive
                    ? "bg-blue-400  text-white"
                    : "text-gray-300 hover:bg-blue-400 hover:text-white"
                }`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Bottom Menu */}
       {/* Bottom Menu */}
<div className="mt-auto flex flex-col">
  {data.map((item) => {
    const isActive = location.pathname === item.path;
    return (
      <div
        key={item.id}
        className={`flex items-center gap-3 px-6 py-5 cursor-pointer rounded-sm transition-colors ${
          isActive
            ? "bg-blue-400 text-white"
            : "text-gray-300 hover:bg-blue-400 hover:text-white"
        }`}
        onClick={() => navigate(item.path)}
      >
        <item.icon className="w-5 h-5" />
        <span className="font-medium">{item.label}</span>
      </div>
    );
  })}
</div>

      </div>
  
  );
}

export default UserNavbar;
