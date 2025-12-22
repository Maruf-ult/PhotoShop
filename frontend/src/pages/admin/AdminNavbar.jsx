import { Camera } from "lucide-react";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA_ADMIN } from "../../../utils/data";
import { UserContext } from "../../context/UseContext";
import { BASE_URL } from "../../../utils/apiPaths";

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, clearUser } = useContext(UserContext);

  return (
    <div className="bg-white w-56 min-h-screen">
      <div className="flex items-center gap-3 px-3 p-2 mt-4 ">
        <Camera className="text-black " size={26} />
        <h1 className="text-black text-2xl font-bold ">PhotoSite</h1>
      </div>
      <div className="flex flex-col mt-8">
        {SIDE_MENU_DATA_ADMIN.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-3 py-5 cursor-pointer rounded-sm transition-colors ${
                isActive
                  ? "bg-gray-300"
                  : "text-black hover:bg-gray-200 "
              }`}
              onClick={() => { 
               if(item.id==="05"){
                    clearUser();
               }
               navigate(item.path)}}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-52 flex gap-4 text-center ">
           <img className="h-14 w-14 rounded-full" src={`${BASE_URL}/uploads/${user.image}`} alt="admin_img" />
           <div className="flex flex-col gap-1">
               <h3 className="text-bg">{user.name}</h3>
               <span className="text-black font-light ">Adminstrator</span>
           </div>
      </div>
    </div>
  );
}

export default AdminNavbar;
