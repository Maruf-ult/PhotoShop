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
    <aside className="w-64 min-h-screen bg-[#15181e] border-r border-gray-800 flex flex-col">
      {/* LOGO */}
      <div className="flex items-center gap-3 px-6 py-6">
        <Camera className="text-blue-500" size={28} />
        <h1 className="text-white text-2xl font-bold">PhotoSite</h1>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 space-y-1">
        {SIDE_MENU_DATA_ADMIN.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (item.id === "05") clearUser();
                navigate(item.path);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-all
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-[#252a32] hover:text-white"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* USER INFO */}
      <div className="px-6 py-5 border-t border-gray-800 flex items-center gap-3">
        <img
          src={`${BASE_URL}/uploads/${user?.image}`}
          className="h-12 w-12 rounded-full object-cover border border-gray-700"
          alt="admin"
        />
        <div>
          <h3 className="text-white font-semibold leading-tight">
            {user?.name}
          </h3>
          <p className="text-xs text-gray-400">Administrator</p>
        </div>
      </div>
    </aside>
  );
}

export default AdminNavbar;
