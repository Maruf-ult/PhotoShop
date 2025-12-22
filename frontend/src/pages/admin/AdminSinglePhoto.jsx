import { Download, Option, Share, ThumbsDown, ThumbsUp } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_PATHS, BASE_URL } from "../../../utils/apiPaths";
import axiosInstance from "../../../utils/axiosInstance";
import { UserContext } from "../../context/UseContext";
import AdminNavbar from "./AdminNavbar";

function AdminSinglePhoto() {
  const [image, setImage] = useState({ comments: [], tags: [] });
  const { user } = useContext(UserContext);
  const [data, setData] = useState({ text: "" });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.IMAGES.GET_IMAGE_BY_ID(id));
        if (res.data?.image) setImage(res.data.image);
      } catch (error) {
        console.error(error);
      }
    };
    fetchImage();
  }, [id]);

  const handleCommentSubmit = async e => {
    e.preventDefault();
    if (!data.text.trim()) return;
    try {
      const res = await axiosInstance.post(API_PATHS.COMMENTS.ADD_COMMENT(id), {
        userId: user.id,
        text: data.text
      });
      setImage(res.data.image);
      setData({ text: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async fileName => {
    if (!fileName) return;
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        API_PATHS.DOWNLOADS.DOWNLOAD_PHOTO,
        { fileName, imageId: id },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Download failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentChange = e => setData({ ...data, [e.target.name]: e.target.value });

  const handleReaction = async (commentId, type) => {
    try {
      const res = await axiosInstance.post(API_PATHS.COMMENTS.LIKE_COMMENT(id), { action: type, commentId });
      if (res.data.success) setImage(res.data.image);
    } catch (error) {
      console.error(error);
    }
  };

  const createdTime = time => {
    const diff = Date.now() - new Date(time).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} days ago`;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours} hours ago`;
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes > 0) return `${minutes} minutes ago`;
    const seconds = Math.floor(diff / 1000);
    return `${seconds} seconds ago`;
  };

  const fileName = image?.image?.split("/").pop();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-full z-50">
        <AdminNavbar />
      </div>

      <div className="flex-1 ml-72 p-8 overflow-y-auto">
        <div className="flex gap-8 flex-wrap">
          {/* IMAGE */}
          <div className="flex border border-gray-300 rounded-xl bg-gray-900 h-[600px] w-[700px] items-center justify-center overflow-hidden shadow-lg">
            <img
              className="h-full w-full p-4 object-contain cursor-pointer"
              src={`${BASE_URL}${image.image}`}
              alt={image.title || "image"}
            />
          </div>

          {/* DETAILS */}
          <div className="flex flex-col space-y-6 w-[400px] bg-white p-6 rounded-xl shadow-md">
            <h1 className="text-2xl font-bold text-gray-800">{image.title}</h1>

            <div className="flex gap-3">
              <button
                onClick={() => handleDownload(fileName)}
                disabled={!fileName || loading}
                className={`flex items-center px-5 py-3 rounded-lg transition text-white ${
                  !fileName || loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
                }`}
              >
                <Download className="mr-2" size={16} />
                {loading ? "Downloading..." : "Download"}
              </button>

              <div className="bg-gray-100 p-3 rounded-md cursor-pointer hover:bg-gray-200">
                <Share className="text-gray-700" size={22} />
              </div>
              <div className="bg-gray-100 p-3 rounded-md cursor-pointer hover:bg-gray-200">
                <Option className="text-gray-700" size={22} />
              </div>
            </div>

            <div className="flex items-center border-y border-gray-200 py-4 gap-4">
              <img
                className="w-12 h-12 rounded-full border object-cover"
                src={`${BASE_URL}/uploads/${image?.user?.image}`}
                alt="user_img"
              />
              <p className="text-gray-800 font-medium">{image?.user?.name}</p>
              <button className="ml-auto text-sm text-white bg-gray-800 px-6 py-2 rounded-md hover:bg-gray-700 transition">
                Follow
              </button>
            </div>

            <p className="text-gray-600 leading-relaxed">{image.description}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              {image.tags.map(tag => (
                <span key={tag} className="text-blue-600 bg-blue-100 px-3 py-1 text-sm font-medium rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* COMMENTS */}
        <div className="flex flex-col gap-6 mt-12 max-w-[700px]">
          <h2 className="text-gray-800 text-2xl font-bold">Comments ({image.comments.length})</h2>

          <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3">
            <div className="flex gap-3">
              <img
                className="w-12 h-12 rounded-full border object-cover"
                src={`${BASE_URL}/uploads/${user?.image}`}
                alt="user_img"
              />
              <textarea
                className="bg-white border border-gray-300 rounded-md px-5 py-3 h-24 w-full text-gray-700 focus:outline-none focus:border-blue-500 transition"
                name="text"
                value={data.text}
                onChange={handleCommentChange}
                placeholder="Add a comment..."
              />
            </div>
            <button className="self-end px-8 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold transition">
              Submit
            </button>
          </form>

          <div className="flex flex-col gap-8 mt-3">
            {image?.comments?.map(item => {
              const isLiked = item.likedBy?.includes(user.id);
              const isDisliked = item.dislikedBy?.includes(user.id);

              return (
                <div key={item._id} className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={`${BASE_URL}/uploads/${item.user?.image}`}
                    alt="commenter"
                  />

                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 font-bold">{item.user?.name}</span>
                      <span className="text-gray-400 text-xs">{createdTime(item.createdAt)}</span>
                    </div>

                    <p className="text-gray-600 mt-1 mb-3 font-light">{item.text}</p>

                    <div className="flex gap-6 items-center">
                      <ReactionButton type="like" isActive={isLiked} count={item.likedBy?.length || 0} onClick={() => handleReaction(item._id, "like")} />
                      <ReactionButton type="dislike" isActive={isDisliked} count={item.dislikedBy?.length || 0} onClick={() => handleReaction(item._id, "dislike")} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reaction Button Component
const ReactionButton = ({ type, isActive, count, onClick }) => {
  const Icon = type === "like" ? ThumbsUp : ThumbsDown;
  const activeColor = type === "like" ? "text-blue-600" : "text-red-600";
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={onClick} className="transition-transform active:scale-125">
        <Icon size={18} fill={isActive ? (type === "like" ? "#2563eb" : "#dc2626") : "none"} className={isActive ? activeColor : "text-gray-400 hover:text-gray-700"} />
      </button>
      <span className={`text-sm ${isActive ? activeColor : "text-gray-400"}`}>{count}</span>
    </div>
  );
};

export default AdminSinglePhoto;
