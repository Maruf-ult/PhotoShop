import AdminNavbar from "./AdminNavbar";
import PhotoUploadForm from "../common/PhotoUploadForm";

function AdminUpload() {
  return (
    <div className="flex h-screen bg-[#1c1f26]">
      <AdminNavbar />
      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Upload Your Photos</h1>
        <PhotoUploadForm />
      </div>
    </div>
  );
}

export default AdminUpload;
