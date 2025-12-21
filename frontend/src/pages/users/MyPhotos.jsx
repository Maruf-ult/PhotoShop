import {
  Delete,
  Download,
  Edit,
  Eraser,
  Search,
  Upload,
  View,
} from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_PATHS, BASE_URL } from "../../../utils/apiPaths.js";
import axiosInstance from "../../../utils/axiosInstance.js";
import { UserContext } from "../../context/UseContext.jsx";
import UpdatePhotoModal from "./UpdatePhotoModal.jsx";
import UserNavbar from "./UserNavbar.jsx";

function MyPhotos() {
  const { user } = useContext(UserContext);
  const [myPhotos, setMyPhotos] = useState([]);
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [downloadCounts, setDownloadCounts] = useState({});
  const navigate = useNavigate();

  const userId = user.id;

  const openEditModal = (photo) => {
    setSelectedPhoto(photo);
    setIsEditOpen(true);
  };
  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedPhoto(null);
  };

  const fetchMyPhotos = async () => {
    if (!userId) return;

    try {
      const res = await axiosInstance.get(
        API_PATHS.IMAGES.GET_IMAGE_BY_USERID(userId)
      );
      setMyPhotos(res.data.images);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyPhotos();
  }, [userId]);

  useEffect(() => {
    if (myPhotos.length > 0) {
      myPhotos.forEach((photo) => {
        getDownloadHistoryById(photo._id);
      });
    }
  }, [myPhotos]);

  const searchedPhotos = useMemo(() => {
    let data = [...myPhotos];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (item) =>
          item?.title?.toLowerCase().includes(q) ||
          item?.category?.toLowerCase().includes(q)
      );
    }
    return data;
  }, [search, myPhotos]);

  console.log(myPhotos);

  const deleteAll = async () => {
    if (!checked) {
      alert("Select all first");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete all photos?"
    );

    if (!confirmDelete) return;

    try {
      const res = await axiosInstance.delete(
        API_PATHS.IMAGES.DELETE_ALL_IMAGE_BY_ID(userId)
      );

      if (res.data.success) {
        alert("All photos deleted");
        setMyPhotos([]);
        setChecked(false); // instantly update UI
      } else {
        alert("Error deleting photos");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  const deleteByImageId = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;
    try {
      const res = await axiosInstance.delete(API_PATHS.IMAGES.DELETE_IMAGE(id));
      if (res.data.success) {
        setMyPhotos((prev) => prev.filter((photo) => photo._id !== id));
        alert("Photo deleted successfully.");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };
  const clearEverything = () => {
    setChecked(false);
  };

  const getDownloadHistoryById = async (id) => {
    try {
      const res = await axiosInstance.get(
        API_PATHS.DOWNLOADS.GET_DOWNLOAD_HISTORY_COUNT(id)
      );
      console.log(res.data);
      if (res.data.success) {
        setDownloadCounts((prev) => ({
          ...prev,
          [id]: res.data.count,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search photos..."
                className="bg-transparent outline-none text-sm"
              />
            </div>

            <button
              onClick={() => navigate("/upload")}
              className="flex cursor-pointer items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold"
            >
              <Upload size={16} className="mr-2" />
              Upload New
            </button>
          </div>
        </div>

        <div className="flex gap-[800px] mt-10 ">
          <div className="inline mt-1  text-white">
            <input
              type="checkbox"
              name="select"
              checked={checked}
              onChange={() => setChecked((prev) => !prev)}
              id=""
            />
            <label className="pl-2">Select All</label>
          </div>

          <div className="flex items-center mt-1 gap-3 text-white ">
            <button
              onClick={clearEverything}
              className="flex cursor-pointer items-center text-white border border-gray-500 hover:bg-blue-700 px-3 rounded-lg py-2 text-sm font-semibold "
            >
              <Eraser className=" mr-2 " size={16} />
              Clear Selected
            </button>

            <button
              onClick={deleteAll}
              className="flex cursor-pointer items-center text-white border  border-gray-500  hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold"
            >
              <Delete size={16} className="mr-2" />
              Delete Selected
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-10">
          {searchedPhotos?.map((item) => (
            <div
              key={item._id}
              className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
            >
              <img
                onClick={() => navigate(`/image/${item._id}`)}
                className="h-44 w-full transition duration-300 ease-in-out group-hover:scale-105"
                src={`${BASE_URL}${item.image}`}
                alt={item.title}
              />

              <div className="bg-black h-40 bottom-0 left-0 right-0 p-2 bg-opacity-50 transition duration-300 ease-in-out group-hover:bg-opacity-75">
                <p className="text-sm font-semibold text-white truncate">
                  {item.title}
                </p>
                <p className="text-gray-300 font-light line-clamp-3">
                  {item.description}
                </p>

                <div className="absolute bottom-0 left-0 right-0 flex p-3 gap-6 text-white">
                  <div className="flex gap-1">
                    <View size={16} />
                    <span className="text-sm font-light">  {item.views ?? 0}</span>
                  </div>

                  <div className="flex gap-1">
                    <Download size={16} />
                    <span className="text-sm font-light">
                      {downloadCounts[item._id] ?? 0}
                    </span>
                  </div>

                  <Edit
                    size={16}
                    className="cursor-pointer hover:text-blue-400"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent image click navigation
                      openEditModal(item);
                    }}
                  />

                  <Delete
                    size={16}
                    className="cursor-pointer hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteByImageId(item._id);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {searchedPhotos.length === 0 && (
          <p className="text-gray-400 mt-10 text-center">No photos found.</p>
        )}
      </div>
      <UpdatePhotoModal
        open={isEditOpen}
        onClose={closeEditModal}
        image={selectedPhoto}
        onUpdated={fetchMyPhotos}
      />
    </div>
  );
}

export default MyPhotos;
