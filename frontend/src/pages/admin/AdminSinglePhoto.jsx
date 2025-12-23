import AdminNavbar from "./AdminNavbar";
import SinglePhotoLayout from "../common/SinglePhotoLayout.jsx"

function AdminSinglePhoto() {
  return <SinglePhotoLayout Navbar={AdminNavbar} isAdmin />;
}

export default AdminSinglePhoto;
