import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Explore from "./pages/common/Explore.jsx";
import Home from "./pages/common/Home.jsx";
import Trending from "./pages/common/Trending.jsx";
import History from "./pages/users/History.jsx";
import MyPhotos from "./pages/users/MyPhotos.jsx";
import UploadPhoto from "./pages/users/UploadPhoto.jsx";
import UserDashboard from "./pages/users/UserDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx"; // 👈 create a separate admin dashboard
import PrivateRoute from "./routes/PrivateRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />

        {/* User routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<UserDashboard />} />
          <Route path="/explore" element={<MyPhotos />} />
          <Route path="/my_photos" element={<History />} />
          <Route path="/upload" element={<UploadPhoto />} />
        </Route>

        {/* Admin routes */}
        <Route element={<PrivateRoute isAdminOnly={true} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<MyPhotos />} />
          <Route path="/admin/photo-management" element={<History />} />
          <Route path="/admin/user-management" element={<UploadPhoto />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;