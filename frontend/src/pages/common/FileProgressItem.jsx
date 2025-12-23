import { CheckCircle, File, Loader2, X } from "lucide-react";

function FileProgressItem({
  isUploading,
  uploadProgress,
  isUploadSuccess,
  imagePreviewUrl,
  imageFile,
  handleRemoveFile,
}) {
  const displayProgress = isUploading
    ? uploadProgress
    : isUploadSuccess
    ? 100
    : 0;

  const displayMessage = isUploading ? (
    <>
      <Loader2 className="inline w-3 h-3 animate-spin mr-1" />
      Uploading... {uploadProgress}%
    </>
  ) : isUploadSuccess ? (
    <span className="text-green-400">
      <CheckCircle className="inline w-3 h-3 mr-1" /> Upload Complete
    </span>
  ) : (
    "Ready to upload"
  );

  return (
    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg mb-3 border border-gray-700">
      <div className="flex items-center space-x-4 w-full">
        
        {/* FIXED: preview wrapper has a fixed size */}
        <div className="w-16 h-16 overflow-hidden rounded-md bg-[#3b414a] flex items-center justify-center">
          {imagePreviewUrl ? (
            <img
              src={imagePreviewUrl}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          ) : (
            <File className="text-gray-400" size={24} />
          )}
        </div>

        {/* FIXED: mix-w-0 → min-w-0 */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">
            {imageFile?.name}
          </p>

          <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${displayProgress}%` }}
            ></div>
          </div>

          <p className="text-gray-400 text-xs mt-1">{displayMessage}</p>
        </div>
      </div>

      {/* Remove button */}
      {!isUploading && !isUploadSuccess && (
        <button
          onClick={handleRemoveFile}
          className="text-gray-500 cursor-pointer hover:text-red-500 transition-colors p-1 ml-4"
          title="Remove File"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export default FileProgressItem;
