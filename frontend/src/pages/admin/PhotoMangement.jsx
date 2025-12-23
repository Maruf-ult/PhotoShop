import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_PATHS, BASE_URL } from "../../../utils/apiPaths.js";
import axiosInstance from "../../../utils/axiosInstance.js";
import { UserContext } from "../../context/UseContext.jsx";
import AdminNavbar from "./AdminNavbar.jsx";
import { Delete, Eye, Search, Filter, Upload } from "lucide-react";

function PhotoMangement() {
  const { user } = useContext(UserContext);
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const allImages = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.IMAGES.GET_IMAGES);
        if (res.data.success) {
          setImages(res.data.images);
        }
      } catch (error) {
        alert(error);
      }
    };
    allImages();
  }, []);

  // 1. Get unique categories for the filter dropdown
  const categories = ["All", ...new Set(images.map((img) => img.category))];

  // 2. Logic to filter and search images
  const filteredImages = images.filter((img) => {
    const matchesSearch = img.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          img.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || img.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const deleteByImageId = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;
    try {
      const res = await axiosInstance.delete(API_PATHS.IMAGES.DELETE_IMAGE(id));
      if (res.data.success) {
        setImages((prev) => prev.filter((photo) => photo._id !== id));
        alert("Photo deleted successfully.");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#1c1f26]">
      <AdminNavbar />
      <div className="flex-1 flex-col p-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-1">
            <h1 className="font-sans font-bold text-3xl text-white">Photo Management</h1>
            <p className="text-gray-400 text-sm font-light">
              Manage, update, and organize all updated content
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Search Bar */}
            <div className="flex items-center bg-[#252a32] border border-gray-700 rounded-md px-3 py-1">
              <Search className="text-gray-400 mr-2" size={18} />
              <input
                type="text"
                placeholder="Search title or tags..."
                className="bg-transparent text-white outline-none text-sm p-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center bg-[#252a32] border border-gray-700 rounded-md px-3 py-1">
              <Filter className="text-gray-400 mr-2" size={18} />
              <select
                className="bg-transparent text-white outline-none text-sm cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#252a32]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Add New Button */}
            <button onClick={()=>navigate("/admin/upload")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium">
              <Upload size={16} />
              Add new photo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-[#252a32] rounded-lg border border-gray-700">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
              <h3 className="font-semibold text-lg text-white">Latest Uploads</h3>
              <span className="text-xs text-gray-400">{filteredImages.length} results found</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#1c1f26] text-gray-400 text-left">
                  <tr>
                    <th className="px-6 py-3">Photo</th>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Uploader</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {filteredImages.length > 0 ? (
                    filteredImages.map((item) => (
                      <tr key={item._id} className="border-t border-gray-700 hover:bg-[#2c323a] transition-colors">
                        <td className="px-6 py-3">
                          <img
                            src={`${BASE_URL}${item.image}`}
                            alt="photo"
                            className="w-12 h-12 rounded-md object-cover"
                          />
                        </td>
                        <td className="px-6 py-3 font-medium text-white">{item.title}</td>
                        <td className="px-6 py-3">
                          <span className="bg-gray-700 px-2 py-1 rounded-full text-xs">{item.category}</span>
                        </td>
                        <td className="px-6 py-3">{item.user?.name}</td>
                        <td className="px-6 py-3">{item.createdAt.split("T")[0]}</td>
                        <td className="px-6 py-3">
                          <div className="flex justify-center gap-4 text-gray-400">
                            <Eye
                              onClick={() => navigate(`/admin/image/${item._id}`)}
                              className="cursor-pointer hover:text-blue-400"
                              size={18}
                            />
                            <Delete
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteByImageId(item._id);
                              }}
                              className="cursor-pointer hover:text-red-400"
                              size={18}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-10 text-gray-500">
                        No images found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoMangement;