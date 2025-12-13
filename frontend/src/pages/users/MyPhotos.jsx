import { Delete, Download, Edit, Search, Upload, View } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { API_PATHS, BASE_URL } from "../../../utils/apiPaths.js";
import axiosInstance from "../../../utils/axiosInstance.js";
import { UserContext } from "../../context/UseContext.jsx";
import UserNavbar from "./UserNavbar.jsx";

function MyPhotos() {
  const { user } = useContext(UserContext);
  const [myPhotos, setMyPhotos] = useState([]);

  const userId = user.id;

  useEffect(() => {
    const getPhotos = async () => {
      try {
        const res = await axiosInstance.get(
          API_PATHS.IMAGES.GET_IMAGE_BY_USERID(userId)
        );
        setMyPhotos(res.data.images);
      } catch (error) {
        console.log(error);
      }
    };
    getPhotos();
  }, []);

  return (
    <div className="flex min-h-screen  bg-[#1c1f26] ">
      <UserNavbar />
      <div className="  flex flex-col  pl-72 p-10  ">
        <div className="flex gap-[670px]  ">
          <h1 className="font-sans font-bold text-3xl text-white ">
            My Photos
          </h1>
          <div className="flex items-center mt-1 gap-3 text-white ">
            <div className="flex items-center bg-transparent border border-gray-500 px-5 py-2 rounded-lg">
              <Search className=" mr-2 " size={16} />
              <input
                type="search"
                placeholder="Search photos..."
                className="bg-transparent outline-none text-sm"
              />
            </div>

            <button className="flex cursor-pointer items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">
              <Upload size={16} className="mr-2" />
              Upload New
            </button>
          </div>
        </div>
       
        <div className="flex gap-[800px] mt-10 ">
          <div className="inline mt-1  text-white">
            <input type="checkbox" name="" id="" />
            <label className="pl-2">Select All</label>
          </div>
          
          <div className="flex items-center mt-1 gap-3 text-white ">
            <button className="flex cursor-pointer items-center text-white border border-gray-500 hover:bg-blue-700 px-3 rounded-lg py-2 text-sm font-semibold ">
              <Edit className=" mr-2 " size={16} />
               Edit Selected
            </button>

            <button className="flex cursor-pointer items-center text-white border  border-gray-500  hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold">
              <Delete size={16} className="mr-2" />
              Delete Selected
            </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-10">
         {myPhotos?.map((item)=>(
           <div key={item._id} className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer">
  <img
    className="h-44 w-full transition duration-300 ease-in-out group-hover:scale-105"
    src={`${BASE_URL}${item.image}`}
    alt={item.title}
  />

  <div className="bg-black h-40 bottom-0 left-0 right-0 p-2 bg-opacity-50 transition duration-300 ease-in-out group-hover:bg-opacity-75">
    <p className="text-sm font-semibold text-white truncate">{item.title}</p>
    <p className="text-gray-300 font-light line-clamp-3">{item.description}</p>

    <div className="absolute bottom-0 left-0 right-0 flex p-3 gap-6 text-white">

      <div className="flex gap-1">
        <View size={16} />
        <span className="text-sm font-light">3.6k</span>
      </div>

      <div className="flex gap-1">
        <Download size={16} />
        <span className="text-sm font-light">2.5k</span>
      </div>

      <Edit size={16} />
      <Delete size={16} />
    </div>
  </div>
</div>

         ))}

      </div>
      </div>
      
    </div>
  );
}

export default MyPhotos;
