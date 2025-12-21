import { Download, Option, Share, ThumbsDown, ThumbsUp } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_PATHS, BASE_URL } from "../../../utils/apiPaths";
import axiosInstance from "../../../utils/axiosInstance";
import { UserContext } from "../../context/UseContext";
import UserNavbar from "./UserNavbar";

function SinglePhoto() {
  const [image, setImage] = useState({ comments: [], tags: [] });
  const { user } = useContext(UserContext);
  const [data, setData] = useState({ text: "" });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  // Fetch single image
  useEffect(() => {
    const getSingleImage = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.IMAGES.GET_IMAGE_BY_ID(id));
        if (res.data?.image) {
          setImage(res.data.image);
        } else {
          alert(res.data?.msg || "Something went wrong");
        }
      } catch (error) {
        console.error(error);
      }
    };
    getSingleImage();
  }, [id]);

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!data.text.trim()) return;
    try {
      const res = await axiosInstance.post(API_PATHS.COMMENTS.ADD_COMMENT(id), {
        userId: user.id,
        text: data.text,
      });
      setImage(res.data.image);
      setData({ text: "" });
    } catch (error) {
      console.error(error);
    }
  };

  // Download file
  const fileName = image?.image?.split("/").pop();

  const handleDownload = async (fileName) => {
    if (!fileName) return alert("File not available for download");
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        API_PATHS.DOWNLOADS.DOWNLOAD_PHOTO,
        { fileName,imageId:id },
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
      if (error.response?.data?.type === "application/json") {
        const reader = new FileReader();
        reader.onload = () => {
          const json = JSON.parse(reader.result);
          alert("Download failed: " + (json.msg || "Unknown error"));
          console.error("Download failed:", json.msg || json);
        };
        reader.readAsText(error.response.data);
      } else {
        alert("Download failed: " + error.message);
        console.error("Download failed:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCommentChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleReaction = async (commentId, type) => {
    try {
      const res = await axiosInstance.post(API_PATHS.COMMENTS.LIKE_COMMENT(id), {
        action: type,
        commentId,
      });
      if (res.data.success) setImage(res.data.image);
    } catch (error) {
      console.error("Reaction Error:", error.response?.data || error.message);
    }
  };

  const createdTime = (time) => {
    const diff = Date.now() - new Date(time).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;
    return `${seconds} seconds ago`;
  };

  return (
    <div className="min-h-screen flex bg-[#1c1f26]">
      <UserNavbar />
      <div className="flex flex-col pl-72 p-8 w-full">
        <div className="flex gap-[60px]">
          {/* IMAGE */}
          <div className="flex border border-gray-600 rounded-lg bg-black h-[600px] w-[700px] items-center justify-center overflow-hidden">
            <img
              className="h-full w-full p-4 object-contain cursor-pointer"
              src={`${BASE_URL}${image.image}`}
              alt={image.title || "image"}
            />
          </div>

          {/* DETAILS */}
          <div className="flex flex-col space-y-6 w-[400px]">
            <h1 className="text-3xl font-bold text-white">{image.title}</h1>

            <div className="flex gap-3">
              <button
                onClick={() => handleDownload(fileName)}
                disabled={!fileName || loading}
                className={`flex items-center px-5 py-3 rounded-lg transition ${
                  !fileName || loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-600"
                }`}
              >
                <Download className="mr-2" size={16} />
                {loading ? "Downloading..." : "Download"}
              </button>

              <div className="bg-gray-700 p-3 rounded-md cursor-pointer hover:bg-gray-600">
                <Share className="text-white" size={24} />
              </div>
              <div className="bg-gray-700 p-3 rounded-md cursor-pointer hover:bg-gray-600">
                <Option className="text-white" size={24} />
              </div>
            </div>

            <div className="flex items-center border-y border-gray-700 py-4 gap-4 mt-6">
              <img
                className="w-12 h-12 rounded-full border border-gray-500 object-cover"
                src={`${BASE_URL}/uploads/${user?.image}`}
                alt="user_img"
              />
              <p className="text-white font-medium">{user?.name}</p>
              <button className="ml-auto text-white bg-gray-700 px-6 py-1.5 rounded-md hover:bg-gray-600 transition">
                Follow
              </button>
            </div>

            <p className="text-gray-300 font-light leading-relaxed">{image.description}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              {image.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-blue-400 bg-blue-900/30 px-3 py-1 text-sm font-semibold rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* COMMENTS */}
        <div className="flex flex-col gap-6 mt-12 max-w-[700px]">
          <h2 className="text-white text-2xl font-bold">
            Comments ({image.comments.length})
          </h2>

          <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3">
            <div className="flex gap-3">
              <img
                className="w-12 h-12 rounded-full border border-gray-500 object-cover"
                src={`${BASE_URL}/uploads/${user?.image}`}
                alt="user_img"
              />
              <textarea
                className="bg-gray-800 border border-gray-700 rounded-md px-5 py-3 h-24 w-full text-gray-200 focus:outline-none focus:border-blue-500 transition"
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
            {image?.comments?.map((item) => {
              const isLiked = item.likedBy?.includes(user.id);
              const isDisliked = item.dislikedBy?.includes(user.id);

              return (
                <div key={item._id} className="flex gap-4">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={`${BASE_URL}/uploads/${item.user?.image}`}
                    alt="commenter"
                  />

                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{item.user?.name}</span>
                      <span className="text-gray-500 text-xs">{createdTime(item.createdAt)}</span>
                    </div>

                    <p className="text-gray-300 mt-1 mb-3 font-light">{item.text}</p>

                    <div className="flex gap-6 items-center">
                      {/* Like */}
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleReaction(item._id, "like")} className="transition-transform active:scale-125">
                          <ThumbsUp
                            size={18}
                            fill={isLiked ? "#3b82f6" : "none"}
                            className={isLiked ? "text-blue-500" : "text-gray-400 hover:text-white"}
                          />
                        </button>
                        <span className={`text-sm ${isLiked ? "text-blue-500" : "text-gray-400"}`}>{item.likedBy?.length || 0}</span>
                      </div>

                      {/* Dislike */}
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleReaction(item._id, "dislike")} className="transition-transform active:scale-125">
                          <ThumbsDown
                            size={18}
                            fill={isDisliked ? "#ef4444" : "none"}
                            className={isDisliked ? "text-red-500" : "text-gray-400 hover:text-white"}
                          />
                        </button>
                        <span className={`text-sm ${isDisliked ? "text-red-500" : "text-gray-400"}`}>{item.dislikedBy?.length || 0}</span>
                      </div>
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

export default SinglePhoto;
