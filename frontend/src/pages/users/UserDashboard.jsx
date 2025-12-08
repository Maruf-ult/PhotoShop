import { useContext } from "react";
import { BASE_URL } from "../../../utils/apiPaths.js";
import { UserContext } from "../../context/UseContext.jsx";
import UserNavbar from "./UserNavbar.jsx";

function UserDashboard() {
  const data = useContext(UserContext);
  const user = data.user;

  console.log(user);

  const options = [
    {
      id: "01",
      level: "My photos",
      path: "/photos",
    },
    {
      id: "02",
      level: "Downloads",
      path: "/downloads",
    },
  ];

  const getYear = (created) => {
    const year = new Date(created).getFullYear();
    return year;
  };

  return (
    <>
      <div className="h-screen bg-gray-800 flex">
        <UserNavbar />
        <div className="flex flex-col space-y-5 p-10">
          <div>
            <h1 className="font-bold text-3xl text-white">
              Welcome back, {user.name}!
            </h1>
            <p className="font-light text-gray-100">
              Here's a look at your recent activity and photos
            </p>
          </div>

          <div className="flex gap-4 p-5">
            <img
              className="w-16 h-16 rounded-full border border-white"
              src={`${BASE_URL}/uploads/${user.image}`}
              alt="user_img"
            />
            <div>
              <div>
                <h1 className="font-bold text-white">{user.name}</h1>
                <h3 className="text-gray-300 font-light text-sm">
                  Member since {getYear(user.createdAt)}
                </h3>
                <h3 className="font-light text-gray-300 text-sm">245 photos uploaded</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
