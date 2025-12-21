import { X, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { API_PATHS, BASE_URL } from "../../../utils/apiPaths";
import axiosInstance from "../../../utils/axiosInstance";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function UpdatePhotoModal({ open, onClose, image, onUpdated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
  });

  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (image && open) {
      setFormData({
        title: image.title,
        description: image.description,
        category: image.category,
        tags: image.tags?.join(", ") || "",
      });
      setNewImage(null);
      setPreview(null);
    }
  }, [image, open]);

  const isChanged = useMemo(() => {
    if (!image) return false;
    return (
      formData.title !== image.title ||
      formData.description !== image.description ||
      formData.category !== image.category ||
      formData.tags !== (image.tags?.join(", ") || "") ||
      newImage
    );
  }, [formData, newImage, image]);

  const handleImageChange = (file) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) return alert("Max 5MB");
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type))
      return alert("Invalid format");

    setNewImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("tags", formData.tags);

    if (newImage) data.append("imageFile", newImage);

    try {
      setLoading(true);

      await axiosInstance.put(
        API_PATHS.IMAGES.UPDATE_IMAGE(image._id),
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) =>
            setProgress(Math.round((e.loaded * 100) / e.total)),
        }
      );

      onUpdated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.msg || "Update failed");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  console.log(image);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-[#1c1f26] p-6 rounded-lg w-full max-w-xl relative">

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 cursor-pointer"
        >
          <X />
        </button>

        <h2 className="text-white text-xl font-bold mb-4">
          Edit Photo
        </h2>

        {/* IMAGE */}
        <div className="flex gap-4 mb-4">
          <img
            src={
              preview ||
              `${BASE_URL}${image.image}`
            }
            className="w-32 h-32 object-cover rounded"
          />

          <label className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded cursor-pointer text-white">
            <Upload size={16} />
            Change
            <input
              hidden
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handleImageChange(e.target.files[0])}
            />
          </label>
        </div>

        {/* FORM */}
        <input
          className="w-full mb-3 p-2 bg-[#252a32] text-white rounded"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />

        <textarea
          className="w-full mb-3 p-2 bg-[#252a32] text-white rounded"
          rows="3"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <select
          className="w-full mb-3 p-2 bg-[#252a32] text-white rounded"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {["Nature","Travel","People","Cityscape","Food","Abstract"].map(c=>(
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          className="w-full mb-4 p-2 bg-[#252a32] text-white rounded"
          value={formData.tags}
          onChange={(e) =>
            setFormData({ ...formData, tags: e.target.value })
          }
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded text-gray-300"
          >
            Cancel
          </button>

          <button
            disabled={!isChanged || loading}
            onClick={handleUpdate}
            className="bg-blue-600 px-4 py-2 rounded text-white disabled:opacity-50"
          >
            {loading ? `Updating ${progress}%` : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdatePhotoModal;
