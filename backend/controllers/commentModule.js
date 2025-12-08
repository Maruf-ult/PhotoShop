import imageModel from "../models/images.js";

export const addComment = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { userId, text } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ success: false, msg: "Comment text is required" });
    }

    const image = await imageModel.findById(imageId);
    if (!image) {
      return res.status(404).json({ success: false, msg: "Image not found" });
    }

    image.comments.push({ user: userId, text });
    await image.save();

    return res
      .status(201)
      .json({ success: true, msg: "Comment added successfully", image });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: `Internal server error: ${error.message}` });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { imageId, commentId } = req.params;

    const image = await imageModel.findById(imageId);
    if (!image) {
      return res.status(404).json({ success: false, msg: "image not found" });
    }
    const comment = image.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, msg: "comment not found" });
    }
    comment.likes += 1;
    await image.save();
    return res
      .status(200)
      .json({ success: true, msg: "Comment liked successfully", comment });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: `Internal server error: ${error.message}` });
  }
};
