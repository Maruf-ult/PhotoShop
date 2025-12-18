import { useContext, useState } from "react";
import { API_PATHS, BASE_URL } from "../../../utils/apiPaths.js";
import axiosInstance from "../../../utils/axiosInstance.js";
import { UserContext } from "../../context/UseContext.jsx";
import UserNavbar from "./UserNavbar.jsx";

function UserSettings() {
  const { user, updateUser } = useContext(UserContext);

  const id = user.id;

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    user?.image ? `${BASE_URL}/uploads/${user.image}` : ""
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);

      if (formData.password) {
        data.append("password", formData.password);
      }
      if (image) {
        data.append("image", image);
      }
      const res = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_USER_BY_ID(id),
        data
      );
      console.log(res.data);
      if (res.data.success) {
        updateUser({
          user: {
            id: res.data.user._id,
            name: res.data.user.name,
            email: res.data.user.email,
            image: res.data.user.image,
            isAdmin: res.data.user.isAdmin,
          },
          token: localStorage.getItem("token"),
        });

        alert("Profile updated successfully");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1c1f26]">
      <UserNavbar />

      <div className="flex flex-col pl-72 p-8">
        <div className="flex gap-[670px]">
          <div className="space-y-3">
            <h1 className="font-sans font-bold text-3xl text-white">
              Settings
            </h1>
            <span className="text-gray-300 font-light">
              Manage your account privacy settings
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 border border-gray-600">
          <div className="p-10 border-b border-gray-600">
            <h1 className="font-sans font-bold text-xl text-gray-100">
              Profile
            </h1>
            <span className="text-gray-400">
              Update your personal information and profile picture.
            </span>
          </div>

          <div className="p-10 flex flex-col">
            {/* Profile Image */}
            <div className="flex gap-3 pt-4 items-center">
              <img
                src={preview || "/default-avatar.png"}
                className="h-16 w-16 rounded-full object-cover"
                alt="profile"
              />

              <label className="bg-blue-500 text-white px-8 py-3 rounded-md cursor-pointer">
                Upload New Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>

              <button
                type="button"
                onClick={removeImage}
                className="bg-gray-600 text-white px-5 py-3 rounded-md"
              >
                Remove
              </button>
            </div>

            {/* Name & Email */}
            <div className="flex gap-10 pt-10">
              <div className="flex flex-col">
                <label className="text-gray-400">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-72 px-4 py-2 border border-gray-700 bg-transparent text-white rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-400">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-72 px-4 py-2 border border-gray-700 bg-transparent text-white rounded-md"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex pt-10 gap-10 items-end">
              <div className="flex flex-col">
                <label className="text-gray-400">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-72 px-4 py-2 border border-gray-700 bg-transparent text-white rounded-md"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-10 py-3 rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserSettings;
