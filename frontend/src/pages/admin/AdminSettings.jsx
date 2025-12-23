import AdminNavbar from "./AdminNavbar.jsx";
import SettingsForm from "../common/SettingsForm.jsx";

function AdminSettings() {

  return (
   <SettingsForm Navbar={AdminNavbar} isAdmin={true} />
  );
}

export default AdminSettings;
