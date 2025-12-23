import { Download, Option, Share, ThumbsDown, ThumbsUp } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_PATHS, BASE_URL } from "../../../utils/apiPaths";
import axiosInstance from "../../../utils/axiosInstance";
import { UserContext } from "../../context/UseContext";

function SinglePhotoLayout({ Navbar, isAdmin }) {
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

  const handleReaction = async (commentId, type) => {
    try {
      const res = await axiosInstance.post(
        API_PATHS.COMMENTS.LIKE_COMMENT(id),
        { action: type, commentId }
      );
      if (res.data.success) setImage(res.data.image);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async (fileName) => {
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
      alert("Download failed", error);
    } finally {
      setLoading(false);
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

  const fileName = image?.image?.split("/").pop();

  return (
    <div className="min-h-screen flex bg-[#1c1f26]">
      <Navbar />

     < div className={`flex-1 ${isAdmin ? "ml-10" : "pl-72"} overflow-y-auto h-screen`}>
        <div className="p-8">
          {/* IMAGE + DETAILS */}
          <div className="flex gap-[60px]">
            <div className="flex border border-gray-600 rounded-lg bg-black h-[600px] w-[700px] items-center justify-center overflow-hidden">
              <img
                className="h-full w-full p-4 object-contain"
                src={`${BASE_URL}${image.image}`}
                alt={image.title}
              />
            </div>

            <div className="flex flex-col space-y-6 w-[400px]">
              <h1 className="text-3xl font-bold text-white">{image.title}</h1>

              <div className="flex gap-3">
                <button
                  onClick={() => handleDownload(fileName)}
                  disabled={loading}
                  className={`flex items-center px-5 py-3 rounded-lg ${
                    loading
                      ? "bg-gray-600"
                      : "bg-blue-700 hover:bg-blue-600"
                  }`}
                >
                  <Download size={16} className="mr-2" />
                  {loading ? "Downloading..." : "Download"}
                </button>

                <div className="bg-gray-700 p-3 rounded-md">
                  <Share />
                </div>
                <div className="bg-gray-700 p-3 rounded-md">
                  <Option />
                </div>
              </div>

              <div className="flex items-center border-y border-gray-700 py-4 gap-4">
                <img
                  className="w-12 h-12 rounded-full border border-gray-500"
                  src={`${BASE_URL}/uploads/${image?.user?.image}`}
                  alt="none"
                />
                <p className="text-white">{image?.user?.name}</p>
              </div>

              <p className="text-gray-300">{image.description}</p>

              <div className="flex flex-wrap gap-2">
                {image.tags.map((tag) => (
                  <span key={tag} className="text-blue-400">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* COMMENTS */}
          <div className="mt-12 max-w-[700px]">
            <h2 className="text-white text-2xl font-bold">
              Comments ({image.comments.length})
            </h2>

            <form onSubmit={handleCommentSubmit} className="mt-6">
              <textarea
                className="w-full bg-gray-800 border border-gray-700 p-4 text-white"
                name="text"
                value={data.text}
                onChange={(e) => setData({ text: e.target.value })}
              />
              <button className="mt-3 bg-blue-600 px-6 py-2 text-white rounded">
                Submit
              </button>
            </form>

            <div className="mt-8 space-y-6">
              {image.comments.map((item) => {
                const isLiked = item.likedBy?.includes(user.id);
                const isDisliked = item.dislikedBy?.includes(user.id);

                return (
                  <div key={item._id} className="flex gap-4">
                    <img
                      className="w-12 h-12 rounded-full"
                      src={`${BASE_URL}/uploads/${item.user?.image}`}
                      alt=""
                    />

                    <div>
                      <p className="text-white font-bold">
                        {item.user?.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {createdTime(item.createdAt)}
                      </p>
                      <p className="text-gray-300 mt-2">{item.text}</p>

                      <div className="flex gap-4 mt-2">
                        <button onClick={() => handleReaction(item._id, "like")}>
                          <ThumbsUp
                            fill={isLiked ? "#3b82f6" : "none"}
                          />
                        </button>
                        <button
                          onClick={() =>
                            handleReaction(item._id, "dislike")
                          }
                        >
                          <ThumbsDown
                            fill={isDisliked ? "#ef4444" : "none"}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePhotoLayout;