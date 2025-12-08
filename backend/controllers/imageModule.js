import imageModel from "../models/images.js";

// Upload Image
export const uploadImage = async (req, res) => {
  try {
    const { image, title, description, tags,category, userId } = req.body;

    if (!image || !title || !description || !category) {
      return res
        .status(400)
        .json({ success: false, msg: "Please fill out all required fields" });
    }

    const newImage = new imageModel({
      user: userId, // associate with uploader
      image,
      title,
      description,
      category,
      tags: tags || [],
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
    return res
      .status(200)
      .json({
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
