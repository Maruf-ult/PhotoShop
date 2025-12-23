import { Delete, Eye, Search, Upload } from "lucide-react";
import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { API_PATHS, BASE_URL } from "../../../utils/apiPaths";
import axiosInstance from "../../../utils/axiosInstance";
import { UserContext } from "../../context/UseContext";
import AdminNavbar from "./AdminNavbar";

// --- 1. Import Chart.js Dependencies ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// --- 2. Register Chart.js Components ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const { user } = useContext(UserContext);
  const [images, setImages] = useState([]);
  const [downloadCount, setDownloadCount] = useState(0);
  const [downloads, setDownloads] = useState([]);
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
    
    const getHistoryCount = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.DOWNLOADS.ALL_DOWNLOAD_HISTORY);
        if (res.data.success) {
          setDownloadCount(res.data.count);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getAllHistory = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.DOWNLOADS.ALL_DOWNLOADS);
        if (res.data.success) {
          setDownloads(res.data.downloads);
        }
      } catch (error) {
        console.log(error);
      }
    };

    allImages();
    getHistoryCount();
    getAllHistory();
  }, []);

  // --- 3. Process Downloads for the Chart ---
  const chartData = useMemo(() => {
    const last7Days = [];
    const dailyCounts = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0]; // YYYY-MM-DD
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      last7Days.push(dayName);

      // Count downloads for this specific date
      const count = downloads.filter(dl => 
        dl.downloadedAt && dl.downloadedAt.split('T')[0] === dateString
      ).length;

      dailyCounts.push(count);
    }

    return {
      labels: last7Days,
      datasets: [
        {
          label: 'Downloads',
          data: dailyCounts,
          backgroundColor: '#3b82f6', // blue-500
          borderRadius: 6,
          hoverBackgroundColor: '#2563eb', // blue-600
        },
      ],
    };
  }, [downloads]);

  // --- 4. Chart Options ---
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1c1f26',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: '#374151',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#94a3b8', stepSize: 1 },
        grid: { color: '#374151' }
      },
      x: {
        ticks: { color: '#94a3b8' },
        grid: { display: false }
      }
    }
  };

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
  const totalComments = images.reduce((acc, curr) => acc + (curr.comments?.length || 0), 0);

  return (
    <div className="min-h-screen bg-[#1c1f26] flex text-gray-300">
      <AdminNavbar />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mt-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-400 mt-1">
              Here is a summary of your website activity
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/upload")}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <Upload size={16} />
            Upload New Photo
          </button>
        </div>

        {/* Stats Cards ... (Keep existing code) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {/* ... stats cards ... */}
            <div className="bg-[#252a32] p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-sm text-gray-400">Total Photos</h3>
                <p className="text-2xl font-bold text-white mt-2">{totalImages}</p>
            </div>
            <div className="bg-[#252a32] p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-sm text-gray-400">Total Users</h3>
                <p className="text-2xl font-bold text-white mt-2">{totalUsers}</p>
            </div>
            <div className="bg-[#252a32] p-6 rounded-lg border-l-4 border-purple-500">
                <h3 className="text-sm text-gray-400">Total Downloads</h3>
                <p className="text-2xl font-bold text-white mt-2">{downloadCount || 0}</p>
            </div>
            <div className="bg-[#252a32] p-6 rounded-lg border-l-4 border-orange-500">
                <h3 className="text-sm text-gray-400">Total Comments</h3>
                <p className="text-2xl font-bold text-white mt-2">{totalComments}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Latest Uploads */}
          <div className="lg:col-span-2 bg-[#252a32] rounded-lg border border-gray-700">
            <h3 className="font-semibold text-lg px-6 py-4 border-b border-gray-700 text-white">
              Latest Uploads
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                {/* ... table content ... */}
                <thead className="bg-[#1c1f26] text-gray-400">
                  <tr>
                    <th className="px-6 py-3 text-left">Photo</th>
                    <th className="px-6 py-3 text-left">Uploader</th>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {images?.slice(0, 3).map((item) => (
                    <tr key={item._id} className="border-t border-gray-700">
                      <td className="px-6 py-3">
                        <img src={`${BASE_URL}${item.image}`} className="w-12 h-12 rounded-md object-cover" alt="photo" />
                      </td>
                      <td className="px-6 py-3">{item.user?.name}</td>
                      <td className="px-6 py-3">{item.createdAt.split("T")[0]}</td>
                      <td className="px-6 py-3">
                        <div className="flex gap-3 text-gray-400">
                          <Eye onClick={() => navigate(`/admin/image/${item._id}`)} className="cursor-pointer hover:text-blue-400" size={18} />
                          <Delete onClick={() => deleteByImageId(item._id)} className="cursor-pointer hover:text-red-400" size={18} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Download Trends (UPDATED SECTION) */}
          <div className="bg-[#252a32] rounded-lg border border-gray-700 p-6 flex flex-col">
            <h3 className="font-semibold text-lg mb-4 text-white">
              Download Trends
            </h3>
            <div className="flex-1 min-h-[250px]">
              {downloads.length > 0 ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                  No data available for the last 7 days
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;