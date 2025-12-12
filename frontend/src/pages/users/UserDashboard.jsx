import { useContext, useEffect, useState } from "react";
import { API_PATHS, BASE_URL } from "../../../utils/apiPaths.js";
import axiosInstance from "../../../utils/axiosInstance.js";
import { UserContext } from "../../context/UseContext.jsx";
import UserNavbar from "./UserNavbar.jsx";

function UserDashboard() {
  const { user } = useContext(UserContext);

  const userId = user._id;

  const [activeTab, setActiveTab] = useState("photos");
  const [myPhotos, setMyphotos] = useState([]);

  useEffect(() => {
    const getMyPhotos = async () => {
      try {
        const res = await axiosInstance.get(
          API_PATHS.IMAGES.GET_IMAGE_BY_USERID(userId)
        );
        console.log(res.data.images);
        setMyphotos(res.data.images);
      } catch (error) {
        console.log(error);
      }
    };
    const getDownloadHistory= async()=>{
      try {
        const res = await axiosInstance.get(API_PATHS.DOWNLOADS.GET_DOWNLOAD_HISTORY)
        console.log(res);
      } catch (error) {
        console.log(error)
      }
    }
    getMyPhotos();
    getDownloadHistory();
  }, []);



  const getYear = (created) => {
    return new Date(created).getFullYear();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-800 flex">
        <UserNavbar />

        <div className="flex-1 pl-72 flex flex-col space-y-5 p-10 overflow-y-auto">
          {/* Greeting */}
          <div>
            <h1 className="font-bold text-3xl text-white">
              Welcome back, {user?.name}!
            </h1>
            <p className="font-light text-gray-100">
              Here's a look at your recent activity and photos
            </p>
          </div>

          {/* Profile Section */}
          <div className="flex gap-4 p-5">
            <img
              className="w-16 h-16 rounded-full border border-white "
              src={`${BASE_URL}/uploads/${user?.image}`}
              alt="user_img"
            />

            <div>
              <h1 className="font-bold text-white">{user?.name}</h1>
              <h3 className="text-gray-300 font-light text-sm">
                Member since {getYear(user?.createdAt)}
              </h3>
              <h3 className="font-light text-gray-300 text-sm">
                245 photos uploaded
              </h3>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-2 ">
            <div className="flex  space-x-4 border-b border-gray-600 pb-2">
              {/* Photos Tab */}
              <div
                onClick={() => setActiveTab("photos")}
                className={`px-2 pb-2 cursor-pointer font-medium ${
                  activeTab === "photos"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-white hover:text-blue-300"
                }`}
              >
                My Photos
              </div>

              {/* History Tab */}
              <div
                onClick={() => setActiveTab("history")}
                className={`px-2 pb-2 cursor-pointer font-medium ${
                  activeTab === "history"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-white hover:text-blue-300"
                }`}
              >
               Download History
              </div>
            </div>
          </div>

          {/* SECTION CONTENT DISPLAY HERE */}
          <div className="mt-0">
            {activeTab === "photos" && (
              <div className=" grid grid-cols-5 gap-4">
                {/* You can replace with API data later */}

                {/* Dummy Images (Replace with real API later) */}
                {myPhotos?.map((item) => (
                  <div
                    key={item._id}
                    className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
                  >
                    <img
                      className="h-44 w-full  transition duration-300 ease-in-out group-hover:scale-105"
                      src={`${BASE_URL}${item.image}`}
                      alt={item.title}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2  bg-opacity-50 transition duration-300 ease-in-out group-hover:bg-opacity-75">
                      <p className="text-sm font-semibold text-white truncate">
                        {item.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "history" && (
              <div className="text-white">
                <ul className="space-y-3">
                  <li className="bg-gray-700 p-3 rounded">
                    Downloaded 5 photos on Monday
                  </li>
                  <li className="bg-gray-700 p-3 rounded">
                    Uploaded 3 photos yesterday
                  </li>
                  <li className="bg-gray-700 p-3 rounded">
                    Edited profile last week
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
