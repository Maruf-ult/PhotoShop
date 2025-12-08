import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../../utils/apiPaths";
import axiosInstance from "../../../utils/axiosInstance";
import { validateEmail } from "../../../utils/helper";
import Navbar from "../../components/header/Navbar";
import { UserContext } from "../../context/UseContext";

function Login() {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateEmail(data.email)) return alert("Invalid email format!");

  try {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, data);

    if (response.data.success) {
      const { token, user } = response.data;
      console.log(token);
      console.log(user);
      updateUser({token,user});

      if (user.isAdmin) navigate("/admin/dashboard");
      else navigate("/home");
    }
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.msg || "Login failed!");
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navbar />

      <div className="h-screen bg-gray-800 flex items-center justify-center text-white px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-700 px-10 py-12 rounded-2xl shadow-lg w-full max-w-md space-y-6 mt-12"
        >
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Sign Into Your Account</h1>
            <p className="text-gray-300 text-sm">
              Welcome back! Let’s continue from where you left.
            </p>
          </div>

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

          <button className="w-full bg-blue-500 cursor-pointer hover:bg-blue-600 py-2 rounded-lg font-semibold mt-4">
            Sign In
          </button>

          <p className="text-center">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 underline cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;
