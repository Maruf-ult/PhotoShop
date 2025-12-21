import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { API_PATHS, BASE_URL } from "../../../utils/apiPaths.js";
import axiosInstance from "../../../utils/axiosInstance.js";
import Navbar from "../../components/header/Navbar.jsx";

const CATEGORIES = [
  "Nature",
  "Travel",
  "People",
  "Cityscape",
  "Food",
  "Clear",
];
const POPULARITY = ["MostViewed", "MostDownloaded", "Newest"];

function Explore() {
  const [myPhotos, setMyPhotos] = useState([]);
  const [search,setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy,setSortBy] = useState("");

  useEffect(() => {
    const getPhotos = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.IMAGES.GET_IMAGES);
        setMyPhotos(res.data.images);
      } catch (error) {
        console.log(error);
      }
    };
    getPhotos();
  }, []);




const filterData = useMemo(() => {
  let data = [...myPhotos];

  // Search filter
  if (search.trim()) {
    const q = search.toLowerCase();
    data = data.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
    );
  }

  // Category filter
  if (category && category !== "clear") {
    data = data.filter(
      (item) => item.category?.toLowerCase() === category
    );
  }
  if (sortBy === "recent") {
      data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    if (sortBy === "popular") {
      data.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
    }
    if (sortBy === "az") {
      data.sort((a, b) => a.title.localeCompare(b.title));
    }

  return data;
}, [myPhotos, search, category,sortBy]);



  return (
    <div className="flex min-h-screen bg-[#1c1f26]">
      <Navbar />

      <div className="flex flex-col pl-32 p-8 mt-16">
        <div className="flex gap-[670px]">
          <div className="space-y-3">
            <h1 className="font-sans font-bold text-3xl text-white">Explore</h1>
            <span className="text-gray-300 font-sm font-light">
              Discover and download high-quality images from our talented
              community.
            </span>
          </div>
        </div>

        <div className="flex gap-10 mt-5 p-1 rounded">
          <div className="flex items-center bg-transparent border border-gray-600 px-5  py-3 rounded-lg mt-1 gap-2 text-white">
            <Search size={16} />
            <input 
             value={search}
             onChange={(e)=>setSearch(e.target.value)}
             type="search"
             placeholder="Search for photos, tags or categories.."
             className="bg-transparent outline-none text-sm w-[1250px]"
            />
          </div>
        </div>
        <div className="flex  ">
          <div className="flex gap-4 text-gray-100 p-1 mt-5 ">
           {CATEGORIES.map((cat) => {
  const value = cat.toLowerCase();

  return (
    <span
      key={cat}
      onClick={() => setCategory(value === "clear" ? "" : value)}
      className={`px-4 py-2 rounded-md cursor-pointer transition
        ${
          category === value
            ? "bg-blue-600 text-white"
            : "bg-gray-700 hover:bg-gray-600"
        }
      `}
    >
      {cat}
    </span>
  );
})}

            <div className="flex text-gray-100 bg-gray-700 p-2 rounded-md gap-4 ml-[508px]">
              <span onClick={()=>setSortBy("recent")} className="bg-gray-800 text-white px-3 cursor-pointer">
                Recent
              </span>
              <span onClick={()=>setSortBy("popular")} className="hover:bg-gray-800 text-white px-3 cursor-pointer">
                Popular
              </span>
              <span onClick={()=>setSortBy("az")} className="hover:bg-gray-800 text-white px-3 cursor-pointer">
                A-Z
              </span>
            </div>
          </div>
        </div>

        <div className=" grid grid-cols-5 gap-4 mt-6 mr-7 p-1">
          {filterData?.map((item) => (
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
          {filterData.length === 0 && (
          <p className="text-gray-400 mt-10 text-center">
            No photos found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Explore;
