import imageModel from "../models/images.js";

// Upload Image
// imageModule.js (Revised uploadImage)

// Upload Image
export const uploadImage = async (req, res) => {
  try {
    // Multer attaches file info to req.file
    const uploadedFile = req.file; // Data from the form fields is in req.body
    const { title, description, tags, category } = req.body;

    // ⚠️ IMPORTANT: Assuming authMiddleware attaches the user ID to req.user or req.userId
    // If not, you must ensure the ID is available here.
    const userId = req.userId; // Use the ID from the authenticated user

    if (!uploadedFile || !title || !description || !category || !userId) {
      return res
        .status(400)
        .json({
          success: false,
          msg: "Please ensure all required fields are filled and an image is selected.",
        });
    }

    // Construct the URL/path for MongoDB
    // Since you are serving files statically from /uploads, the image URL will be relative to your server base.
    const imagePath = `/${uploadedFile.path.replace(/\\/g, "/")}`; // Ensure forward slashes for URL compatibility

    const newImage = new imageModel({
      user: userId, // associate with uploader from authMiddleware
      image: imagePath, // 🆕 Save the path to the stored image
      title,
      description,
      category, // Split the tags string into an array
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    });

    await newImage.save();

    return res.status(201).json({
      success: true,
      msg: "Image uploaded successfully",
      newImage,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: `Internal server error: ${error.message}` });
  }
};

// ... other controller functions (getImages, getImageById, etc.) remain the same

// Get All Images
export const getImages = async (req, res) => {
  try {
    const images = await imageModel
      .find()
      .populate("user", "name email image") // populate uploader info
      .populate("comments.user", "name email image"); // populate commenters

    if (!images || images.length === 0) {
      return res.status(404).json({ success: false, msg: "No images found" });
    }

    return res.status(200).json({
      success: true,
      msg: "Images rendered successfully",
      images,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: `Internal server error: ${error.message}` });
  }
};

// Get Image By ID
export const getImageById = async (req, res) => {
  try {
    const imageId = req.params.id;
    const image = await imageModel
      .findById(imageId)
      .populate("user", "name email image")
      .populate("comments.user", "name email image");

    if (!image) {
      return res.status(404).json({ success: false, msg: "Image not found" });
    }

    return res.status(200).json({
      success: true,
      msg: "Image rendered successfully",
      image,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: `Internal server error: ${error.message}` });
  }
};

//Update Image
export const updateImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    const updateData = { ...req.body };

    if (!imageId) {
      return res.status(404).json({ success: false, msg: "Image not found" });
    }

    const updatedImage = await imageModel.findByIdAndUpdate(
      imageId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ success: false, msg: "Image not found" });
    }
    return res.status(200).json({
      success: true,
      msg: "Image updated successfully",
      image: updatedImage,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: `Internal server error: ${error.message}` });
  }
};

//Delete Image
export const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;

    if (!imageId) {
      return res.status(404).json({ success: false, msg: "Image not found" });
    }

    const deletedImage = await imageModel.findByIdAndDelete(imageId);

    if (!deletedImage) {
      return res.status(404).json({ success: false, msg: "Image not found" });
    }
    return res
      .status(200)
      .json({ success: true, msg: "Image deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: `Internal server error: ${error.message}` });
  }
};
