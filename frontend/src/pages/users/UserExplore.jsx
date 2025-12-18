import { Search } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_PATHS, BASE_URL } from "../../../utils/apiPaths.js";
import axiosInstance from "../../../utils/axiosInstance.js";
import { UserContext } from "../../context/UseContext.jsx";
import UserNavbar from "./UserNavbar.jsx";

const CATEGORIES = [
  "Nature",
  "Travel",
  "People",
  "Cityscape",
  "Food",
  "Abstract",
];
const POPULARITY = ["MostViewed", "MostDownloaded", "Newest"];

function UserExplore() {
  const { user } = useContext(UserContext);
  const [myPhotos, setMyPhotos] = useState([]);

  // UI-only state (no filtering logic added)
  const [category, setCategory] = useState("All");
  const [popularity, setPopularity] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const userId = user.id;

  useEffect(() => {
    const getPhotos = async () => {
      try {
        const res = await axiosInstance.get(
          API_PATHS.IMAGES.GET_IMAGES
        );
        setMyPhotos(res.data.images);
      } catch (error) {
        console.log(error);
      }
    };
    getPhotos();
  }, [userId]);

  const filteredPhotos = useMemo(() => {
    let data = [...myPhotos];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q)
      );
    }
    if (category != "All") {
      data = data.filter((item) => item.category === category);
    }
    if (popularity === "MostViewed") {
      data.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    if (popularity === "MostDownloaded") {
      data.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    }
        if (popularity === "Newest") {
      data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return data;


  },[myPhotos,search,category,popularity]);

  return (
    <div className="flex min-h-screen bg-[#1c1f26]">
      <UserNavbar />

      <div className="flex flex-col pl-72 p-8">
        <div className="flex gap-[670px]">
          <div className="space-y-3">
            <h1 className="font-sans font-bold text-3xl text-white">Explore</h1>
            <span className="text-gray-300 font-sm font-light">
              Discover amazing photos from our talented community.
            </span>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex gap-10 mt-10 border border-gray-700 p-4 rounded">
          {/* Search input */}
          <div className="flex items-center bg-transparent border border-gray-600 px-5 py-3 rounded-lg mt-1 gap-2 text-white">
            <Search size={16} />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for photos, tags or categories.."
              className="bg-transparent outline-none text-sm"
            />
          </div>

          {/* Category Select */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-transparent border border-gray-600 text-gray-400 px-4   rounded-lg text-sm font-semibold cursor-pointer"
          >
            <option value="All" className="text-black ">
              All Categories
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="text-black ">
                {cat}
              </option>
            ))}
          </select>

          {/* Popularity Select */}
          <select
            value={popularity}
            onChange={(e) => setPopularity(e.target.value)}
            className="bg-transparent border border-gray-600 text-gray-400 px-4  rounded-lg text-sm font-semibold cursor-pointer"
          >
            <option value="All" className="text-black">
              Popularity
            </option>
            {POPULARITY.map((p) => (
              <option key={p} value={p} className="text-black">
                {p}
              </option>
            ))}
          </select>

          {/* Search Button */}
          <button className="flex cursor-pointer items-center text-white bg-blue-600 hover:bg-blue-500 px-12  rounded-lg text-sm font-semibold">
            Search
          </button>
        </div>

        {/* PHOTO GRID */}
        <div className=" grid grid-cols-5 gap-4 mt-10">
          {/* You can replace with API data later */}

          {/* Dummy Images (Replace with real API later) */}
          {filteredPhotos?.map((item) => (
            <div
              key={item._id}
              className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
            >
              <img
                onClick={() => navigate(`/image/${item._id}`)}
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
           {filteredPhotos.length === 0 && (
          <p className="text-gray-400 mt-10 text-center">
            No photos found.
          </p>
        )}
      </div>
    </div>
  );
}

export default UserExplore;
