import { Search, Star } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Explore", path: "/explore" },
    { label: "Trending", path: "/trending" },
  ];

  return (
    <header>
      <nav className="shadow-inner shadow-indigo-50 bg-gray-800 fixed top-0 left-0 w-full z-50">
        <ul className="flex p-4 justify-between text-white">
          {/* Left Side */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Star />
              <h1 className="font-bold text-lg tracking-wide">PhotoShare</h1>
            </div>

            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} className="relative">
                  <Link
                    to={item.path}
                    className={`px-2 py-1 font-medium ${
                      isActive ? "after:block after:h-0.5 after:bg-blue-500 after:absolute after:-bottom-1 after:left-0 after:right-0" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex gap-4 items-center">
            <li>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  className="myBox rounded-md p-1.5 pl-8"
                  type="text"
                  placeholder="Search"
                />
              </div>
            </li>

            <li>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-500 text-white px-4 py-1.5 cursor-pointer rounded-md"
              >
                Upload
              </button>
            </li>

            <li>
              <button
                onClick={() => navigate("/login")}
                className="font-bold px-4 py-1.5 rounded-md border cursor-pointer border-white"
              >
                Log In
              </button>
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
