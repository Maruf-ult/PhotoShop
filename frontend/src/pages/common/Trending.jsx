import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { API_PATHS, BASE_URL } from "../../../utils/apiPaths.js";
import axiosInstance from "../../../utils/axiosInstance.js";
import Navbar from "../../components/header/Navbar.jsx";

const CATEGORIES = ["Nature", "Travel", "People", "Cityscape", "Food", "Abstract"];
const POPULARITY = ["Hot Now", "This Week", "This Month", "Rising", "clear"];

function Trending() {
  const [myPhotos, setMyPhotos] = useState([]);
  const [category, setCategory] = useState("");
  const [popularity, setPopularity] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(""); // "popular", "liked", "views"

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

  const getTimeDiff = (time) => {
    const diff = Date.now() - new Date(time).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    return { seconds, minutes, hours, days };
  };

  const getLikeCount = (photo) => {
    if (!photo.comments) return 0;
    return photo.comments.reduce((acc, c) => acc + (c.likedBy?.length || 0), 0);
  };

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
      data = data.filter((item) => item.category?.toLowerCase() === category);
    }

    // Popularity filters
    if (popularity === "Hot Now") {
      data = data.filter((item) => getTimeDiff(item.createdAt).hours <= 24);
    }
    if (popularity === "This Week") {
      data = data.filter((item) => getTimeDiff(item.createdAt).days <= 7);
    }
    if (popularity === "This Month") {
      data = data.filter((item) => getTimeDiff(item.createdAt).days <= 30);
    }
    if (popularity === "Rising") {
      data = data.filter((item) => getTimeDiff(item.createdAt).hours <= 12);
    }
    if (popularity === "clear") {
      setCategory("");
      setPopularity("");
      setSortBy("");
    }

    // Sorting
    if (sortBy === "popular") {
      data.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
    }
    if (sortBy === "liked") {
      data.sort((a, b) => getLikeCount(b) - getLikeCount(a));
    }
    if (sortBy === "views") {
      data.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    return data;
  }, [myPhotos, category, search, popularity, sortBy]);

  return (
    <div className="flex min-h-screen bg-[#1c1f26]">
      <Navbar />

      <div className="flex flex-col pl-32 p-8 mt-16">
        <div className="flex gap-[670px]">
          <div className="space-y-3">
            <h1 className="font-sans font-bold text-3xl text-white">Trending</h1>
            <span className="text-gray-300 font-sm font-light">
              Discover the most popular images buzzing in our community right now.
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-10 mt-5 p-1 rounded">
          <div className="flex items-center bg-transparent border border-gray-600 px-5 py-3 rounded-lg mt-1 gap-2 text-white">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Search for photos, tags or categories.."
              className="bg-transparent outline-none text-sm w-[1250px]"
            />
          </div>
        </div>

        {/* Popularity filters */}
        <div className="flex">
          <div className="flex gap-4 text-gray-100 p-1 mt-5">
            {POPULARITY.map((cat) => (
              <span
                onClick={() => setPopularity(cat)}
                key={cat}
                className={`bg-gray-700 px-4 rounded-md py-2 cursor-pointer ${
                  popularity === cat && cat !== "clear" ? "bg-gray-900" : ""
                }`}
              >
                {cat}
              </span>
            ))}

            {/* Sorting */}
            <div className="flex text-gray-100 bg-gray-700 p-2 rounded-md gap-4 ml-[480px]">
              <span
                onClick={() => setSortBy("popular")}
                className="hover:bg-gray-800 text-white px-2 cursor-pointer"
              >
                Popular
              </span>
              <span
                onClick={() => setSortBy("liked")}
                className="hover:bg-gray-800 text-white px-2 cursor-pointer"
              >
                Most Liked
              </span>
              <span
                onClick={() => setSortBy("views")}
                className="hover:bg-gray-800 text-white px-2 cursor-pointer"
              >
                Most Views
              </span>
            </div>
          </div>
        </div>

        {/* Photos grid */}
        <div className="grid grid-cols-5 gap-4 mt-6 p-1 mr-7">
          {filterData?.map((item) => (
            <div
              key={item._id}
              className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
            >
              <img
                className="h-44 w-full transition duration-300 ease-in-out group-hover:scale-105"
                src={`${BASE_URL}${item.image}`}
                alt={item.title}
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-opacity-50 transition duration-300 ease-in-out group-hover:bg-opacity-75">
                <p className="text-sm font-semibold text-white truncate">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filterData.length === 0 && (
          <p className="text-gray-400 mt-10 text-center">No photos found.</p>
        )}
      </div>
    </div>
  );
}

export default Trending;