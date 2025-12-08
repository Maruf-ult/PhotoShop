import React, { useRef, useState } from "react";
import { User, Upload, Trash } from "lucide-react";

function ProfilePhotoSelector({ image, setImage }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];   // FIXED
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    if (inputRef.current) {
      inputRef.current.value = null; // FIXED
      inputRef.current.click();
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="relative w-20 h-20 bg-blue-100/50 rounded-full flex items-center justify-center cursor-pointer">
          <User className="text-4xl text-primary" />
          <button
            type="button"
            onClick={onChooseFile}
            className="absolute -bottom-0.5 -right-0.5 w-10 cursor-pointer h-8 bg-primary text-white rounded-full flex items-center justify-center"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative w-20 h-20">
          <img
            src={previewUrl}
            alt="profile"
            className="w-full h-full rounded-full object-cover"
          />

          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePhotoSelector;
