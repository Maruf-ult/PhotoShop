import { Upload } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { API_PATHS } from "../../../utils/apiPaths";
import axiosInstance from "../../../utils/axiosInstance";
import { UserContext } from "../../context/UseContext";
import FileProgressItem from "./FileProgressItem";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function PhotoUploadForm() {
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);

  // TOAST STATE
  const [toast, setToast] = useState({
    message: "",
    type: "", // "success" or "error"
    show: false,
  });

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  // SHOW TOAST (with auto-hide)
  const triggerToast = (message, type) => {
    setToast({ message, type, show: true });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const processFile = (file) => {
    setIsUploadSuccess(false);
    setUploadProgress(0);

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      triggerToast("File size exceeds 5MB limit.", "error");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      triggerToast("Invalid file type. Supports JPG & PNG.", "error");
      return;
    }

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreviewUrl(url);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleRemoveFile = () => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImageFile(null);
    setImagePreviewUrl(null);
    setIsUploadSuccess(false);
    setUploadProgress(0);
  };

  // Drag Events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile || !formData.title || !formData.description || !formData.category || !user) {
      triggerToast("Please fill all required fields (*) and select an image.", "error");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const data = new FormData();
    data.append("imageFile", imageFile);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("tags", formData.tags);

    try {
      const response = await axiosInstance.post(API_PATHS.IMAGES.UPLOAD_IMAGE, data, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(percent);
        },
      });

      setIsUploading(false);
      setIsUploadSuccess(true);
      triggerToast(response.data.msg || "Image uploaded successfully!", "success");

      // Reset form (keep preview until user removes)
      setFormData({
        title: "",
        description: "",
        category: "",
        tags: "",
      });

    } catch (error) {
      const msg = error.response?.data?.msg || error.message || "Upload failed due to an unknown error.";
      setIsUploading(false);
      setIsUploadSuccess(false);
      setUploadProgress(0);
      triggerToast(msg, "error");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex space-x-10">
             {/* LEFT SECTION */}
             <div className="flex flex-col w-1/2">
               {/* Upload Box */}
               <div
                 className={`border-2 border-dashed p-10 rounded-lg text-center mb-6 h-[250px] flex flex-col justify-center items-center transition-colors ${
                   isDragging ? "border-blue-500 bg-[#353a42]" : "border-gray-600 bg-[#252a32]"
                 }`}
                 onDragOver={handleDragOver}
                 onDragLeave={handleDragLeave}
                 onDrop={handleDrop}
               >
                 <Upload className="mx-auto mb-3 text-gray-500" size={48} />
                 <p className="text-white font-semibold mb-1">Drag & drop your file</p>
                 <p className="text-gray-400 text-sm mb-4">JPG or PNG · Max 5MB</p>
   
                 <input
                   type="file"
                   accept=".jpg,.jpeg,.png"
                   onChange={handleFileChange}
                   className="hidden"
                   id="file-upload-input"
                   key={imageFile}
                 />
   
                 <label
                   htmlFor="file-upload-input"
                   className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md cursor-pointer"
                 >
                   Browse File
                 </label>
               </div>
   
               {/* File Preview */}
               <div className="mb-2">
                 {imageFile ? (
                   <FileProgressItem
                     isUploading={isUploading}
                     uploadProgress={uploadProgress}
                     isUploadSuccess={isUploadSuccess}
                     imagePreviewUrl={imagePreviewUrl}
                     imageFile={imageFile}
                     handleRemoveFile={handleRemoveFile}
                   />
                 ) : (
                   <p className="text-gray-400 text-sm text-center">
                     Select or drag a file to upload.
                   </p>
                 )}
               </div>
   
               {/* INLINE TOAST BELOW FILE PREVIEW */}
               {toast.show && (
                 <div
                   className={`px-4 py-3 rounded shadow flex items-center gap-3 text-white mt-2 ${
                     toast.type === "success" ? "bg-green-600" : "bg-red-600"
                   }`}
                 >
                   <span>{toast.message}</span>
                   <button
                     onClick={() => setToast((prev) => ({ ...prev, show: false }))}
                     className="text-white text-xl font-bold leading-none ml-auto"
                   >
                     ×
                   </button>
                 </div>
               )}
             </div>
   
             {/* RIGHT FORM SECTION */}
             <div className="flex flex-col w-1/2 space-y-5">
               {/* Title */}
               <div className="flex flex-col space-y-1">
                 <label className="text-white text-sm font-medium">Title *</label>
                 <input
                   type="text"
                   name="title"
                   placeholder="e.g. Summer Vacation in the Alps"
                   value={formData.title}
                   onChange={handleInputChange}
                   className="w-full p-3 rounded-md bg-[#252a32] border border-gray-700 text-white placeholder-gray-500"
                 />
               </div>
   
               {/* Description */}
               <div className="flex flex-col space-y-1">
                 <label className="text-white text-sm font-medium">Description *</label>
                 <textarea
                   name="description"
                   placeholder="A short description..."
                   rows="4"
                   value={formData.description}
                   onChange={handleInputChange}
                   className="w-full p-3 rounded-md bg-[#252a32] border border-gray-700 text-white placeholder-gray-500 resize-none"
                 ></textarea>
               </div>
   
               {/* Category */}
               <div className="flex flex-col space-y-1">
                 <label className="text-white text-sm font-medium">Category *</label>
                 <select
                   name="category"
                   value={formData.category}
                   onChange={handleInputChange}
                   className="w-full p-3 rounded-md bg-[#252a32] border border-gray-700 text-white cursor-pointer"
                 >
                   <option value="">Select Category</option>
                   {["Nature", "Travel", "People", "Cityscape", "Food", "Abstract"].map((category) => (
                     <option key={category} value={category}>
                       {category}
                     </option>
                   ))}
                 </select>
               </div>
   
               {/* Tags */}
               <div className="flex flex-col space-y-1">
                 <label className="text-white text-sm font-medium">Tags</label>
                 <input
                   type="text"
                   name="tags"
                   placeholder="mountains, sunset, travel"
                   value={formData.tags}
                   onChange={handleInputChange}
                   className="w-full p-3 rounded-md bg-[#252a32] border border-gray-700 text-white placeholder-gray-500"
                 />
                 <p className="text-gray-400 text-xs">Use commas to separate tags</p>
               </div>
   
               {/* Buttons */}
               <div className="pt-6 flex justify-end space-x-3">
                 <button
                   type="button"
                   onClick={() => {
                     setFormData({ title: "", description: "", category: "", tags: "" });
                     handleRemoveFile();
                   }}
                   className="px-6 py-2 bg-transparent cursor-pointer hover:bg-gray-700 text-gray-300 font-medium rounded-md border border-gray-600"
                 >
                   Cancel
                 </button>
   
                 <button
                   type="submit"
                   disabled={
                     isUploading || isUploadSuccess || !imageFile || !formData.title || !formData.category || !formData.description
                   }
                   className="px-6 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50"
                 >
                   {isUploading ? `Uploading ${uploadProgress}%…` : isUploadSuccess ? "Upload Complete" : "Upload Photo"}
                 </button>
               </div>
             </div>
           </form>
  );
}

export default PhotoUploadForm;
