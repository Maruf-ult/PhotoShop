import UserNavbar from "./UserNavbar";
import PhotoUploadForm from "../common/PhotoUploadForm";

function UploadPhoto() {
  return (
    <div className="flex h-screen bg-[#1c1f26]">
      <UserNavbar />
      <div className="flex-1 pl-72 p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Upload Your Photos
        </h1>
        <PhotoUploadForm />
      </div>
    </div>
  );
}

export default UploadPhoto;
