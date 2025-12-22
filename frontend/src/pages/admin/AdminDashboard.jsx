import { Delete, Eye, Search, Upload } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_PATHS, BASE_URL } from "../../../utils/apiPaths";
import axiosInstance from "../../../utils/axiosInstance";
import { UserContext } from "../../context/UseContext";
import AdminNavbar from "./AdminNavbar";

function AdminDashboard() {
  const { user } = useContext(UserContext);
  const [images, setImages] = useState([]);
  const [downloadCount, setDownloadCount] = useState(0);
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
    const getHistory = async () => {
      try {
        const res = await axiosInstance.get(
          API_PATHS.DOWNLOADS.ALL_DOWNLOAD_HISTORY
        );
        console.log(res.data);
        if (res.data.success) {
          console.log(res.data);
          setDownloadCount(res.data.count);
        }
      } catch (error) {
        console.log(error);
      }
    };
    allImages();
    getHistory();
  }, []);

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

  const totalUsers = new Set(images.map((item) => item.user?._id)).size;

  const totalImages = images.length;

  const totalComments = new Set(images.map((item) => item.comments?._id)).size;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminNavbar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Top Search Bar */}
        <div className="flex items-center bg-white px-4 py-2 rounded-md shadow-sm w-full max-w-md">
          <Search className="text-gray-400 mr-3" size={18} />
          <input
            type="text"
            placeholder="Search for photos, users..."
            className="w-full outline-none text-sm text-gray-600"
          />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mt-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-500 mt-1">
              Here is a summary of your website activity
            </p>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition">
            <Upload size={16} />
            Upload New Photo
          </button>
        </div>

        {/* Stats Cards */}
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {/* Total Photos */}
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <h3 className="text-sm text-gray-500">Total Photos</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {totalImages}
            </p>
            <p className="text-sm text-blue-500 mt-1">+3.4% this month</p>
          </div>

          {/* Total Users */}
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <h3 className="text-sm text-gray-500">Total Users</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {totalUsers}
            </p>
            <p className="text-sm text-green-500 mt-1">+2.1% this month</p>
          </div>

          {/* Total Downloads */}
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
            <h3 className="text-sm text-gray-500">Total Downloads</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {downloadCount || 0}
            </p>
            <p className="text-sm text-purple-500 mt-1">+5.7% this month</p>
          </div>

          {/* Storage Used */}
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
            <h3 className="text-sm text-gray-500">Total Comments</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {totalComments}
            </p>
            <p className="text-sm text-orange-500 mt-1">+10 this month</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Latest Uploads */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg px-6 py-4 border-b">
              Latest Uploads
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left">Photo</th>
                    <th className="px-6 py-3 text-left">Uploader</th>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {images?.slice(0, 3).map((item) => (
                    <tr key={item._id} className="border-t">
                      <td className="px-6 py-3">
                        <img
                          src={`${BASE_URL}${item.image}`}
                          alt="photo"
                          className="w-12 h-12 bg-gray-200 rounded-md"
                        />
                      </td>
                      <td className="px-6 py-3">{item.user?.name}</td>
                      <td className="px-6 py-3">
                        {item.createdAt.split("T")[0]}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex gap-3 text-gray-600">
                          <Eye
                            onClick={() => navigate(`/admin/image/${item._id}`)}
                            className="cursor-pointer hover:text-blue-500"
                            size={18}
                          />
                          {/* <Edit
                          className="cursor-pointer hover:text-green-500"
                          size={18}
                        /> */}
                          <Delete
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteByImageId(item._id);
                            }}
                            className="cursor-pointer hover:text-red-500"
                            size={18}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Download Trends */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4">Download Trends</h3>
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
              Chart coming soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
