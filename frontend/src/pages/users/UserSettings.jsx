import UserNavbar from "./UserNavbar.jsx";
import SettingsForm from "../common/SettingsForm.jsx";
function UserSettings() {

  return (
   <SettingsForm Navbar={UserNavbar} isAdmin={false} />
  );
}

export default UserSettings;
