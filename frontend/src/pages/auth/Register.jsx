import React, { useContext, useState } from "react";
import Navbar from "../../components/header/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import ProfilePhotoSelector from "./ProfilePhotoSelector";
import { validateEmail } from "../../../utils/helper";
import  { UserContext } from "../../context/UseContext.jsx";

function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const { updateUser } = useContext(UserContext);
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateEmail(data.email)) {
    return alert("Invalid email format!");
  }

  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (profilePic instanceof File) {
      formData.append("image", profilePic); // IMPORTANT: must match multer.single("image")
    }

    const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

 if (res.data.success) {
  const { token, user } = res.data;
  localStorage.setItem("token", token);
  localStorage.setItem("userId", user.id);
  updateUser(user);

  navigate("/user/dashboard");
}

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.msg || "Registration failed!");
  }
};


  return (
    <>
      <Navbar />

      <div className="h-screen bg-gray-800 flex items-center justify-center text-white px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-700 px-10 rounded-2xl shadow-lg w-full max-w-md space-y-4 mt-16"
        >
          <div className="text-center space-y-2 mt-2">
            <h1 className="text-2xl font-bold">Create An Account</h1>
            <p className="text-gray-300 text-sm">
              Join our community to share and discover amazing photos.
            </p>

            {/* FIXED IMAGE SECTION */}
            <div className="flex flex-col items-center space-y-1">
              <label className="text-sm text-gray-300">Image</label>
              <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
            </div>
          </div>

          <label className="flex flex-col space-y-1">
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="px-3 py-2 rounded bg-gray-600 focus:outline-none"
            />
          </label>

          <label className="flex flex-col space-y-1">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="px-3 py-2 rounded bg-gray-600 focus:outline-none"
            />
          </label>

          <label className="flex flex-col space-y-1">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Password"
              className="px-3 py-2 rounded bg-gray-600 focus:outline-none"
            />
          </label>

          <button className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg font-semibold mt-4">
            Create Account
          </button>

          <p className="text-center pb-2">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer"
            >
              Sign in
            </span>
          </p>
        </form>
      </div>
    </>
  );
}

export default Register;
