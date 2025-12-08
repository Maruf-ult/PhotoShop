import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
 const response = await axiosInstance.post(
  API_PATHS.IMAGES.UPLOAD_IMAGE,
  formData,
  { headers: { "Content-Type": "multipart/form-data" } }
);

    console.log("Full Axios Response:", response);
    console.log("Response Data:", response.data);

    if (!response || !response.data) {
      throw new Error("No response from the server");
    }
    return response.data;
  } catch (error) {
    console.error(
      "Error uploading the image:",
      error.respone ? error.respone.data : error.message
    );
    throw error;
  }
};

export default uploadImage;
