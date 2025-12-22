import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx"; // 👈 create a separate admin dashboard
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Explore from "./pages/common/Explore.jsx";
import Home from "./pages/common/Home.jsx";
import Trending from "./pages/common/Trending.jsx";
import History from "./pages/users/History.jsx";
import MyPhotos from "./pages/users/MyPhotos.jsx";
import SinglePhoto from "./pages/users/SinglePhoto.jsx";
import UploadPhoto from "./pages/users/UploadPhoto.jsx";
import UserDashboard from "./pages/users/UserDashboard.jsx";
import UserExplore from "./pages/users/UserExplore.jsx";
import UserSettings from "./pages/users/UserSettings.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";
import AdminSinglePhoto from "./pages/admin/AdminSinglePhoto.jsx"; // 👈 Import the new route

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          {/* If logged in, / and /login will redirect to /home */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* 2. PUBLIC/COMMON ROUTES (Always accessible, no auth check needed) */}
        {/* These pages can be seen by both logged in and logged out users */}
        <Route path="/trending" element={<Trending />} />
        <Route path="/explore" element={<Explore />} />

        {/* 3. USER ROUTES (Only accessible when LOGGED IN) */}
        <Route element={<PrivateRoute isAdminOnly={false} />}>
          <Route path="/home" element={<UserDashboard />} />
          <Route path="/my_photos" element={<MyPhotos />} />
          <Route path="/upload" element={<UploadPhoto />} />
          <Route path="/user_explore" element={<UserExplore />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/image/:id" element={<SinglePhoto />} />
        </Route>

        {/* 4. ADMIN ROUTES (Only accessible when LOGGED IN & is admin) */}
        <Route element={<PrivateRoute isAdminOnly={true} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<MyPhotos />} />
          <Route path="/admin/photo-management" element={<History />} />
          <Route path="/admin/user-management" element={<UploadPhoto />} />
           <Route path="/admin/image/:id" element={<AdminSinglePhoto />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
