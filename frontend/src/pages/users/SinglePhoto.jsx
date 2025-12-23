import UserNavbar from "./UserNavbar";
import SinglePhotoLayout from "../common/SinglePhotoLayout.jsx"

function SinglePhoto() {
  return <SinglePhotoLayout Navbar={UserNavbar} isAdmin={false} />;
}

export default SinglePhoto;
