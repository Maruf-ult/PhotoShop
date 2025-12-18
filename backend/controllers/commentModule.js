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
    const { imageId } = req.params;
    const { action, commentId } = req.body;
    
    // ✅ FIXED: Use req.userId instead of req.user.id (matches your auth middleware)
    if (!req.userId) {
      return res.status(401).json({ 
        success: false, 
        msg: "User not authenticated" 
      });
    }
    
    const userId = req.userId;

    // Validate required fields
    if (!action || !commentId) {
      return res.status(400).json({ 
        success: false, 
        msg: "Action and commentId are required" 
      });
    }

    const image = await imageModel.findById(imageId);
    if (!image) {
      return res.status(404).json({ 
        success: false, 
        msg: "Image not found" 
      });
    }

    // Use Mongoose .id() to find the subdocument
    const comment = image.comments.id(commentId);
    
    if (!comment) {
      return res.status(404).json({ 
        success: false, 
        msg: "Comment not found" 
      });
    }

    // Initialize arrays if they don't exist in older documents
    if (!comment.likedBy) comment.likedBy = [];
    if (!comment.dislikedBy) comment.dislikedBy = [];

    if (action === "like") {
      if (comment.likedBy.includes(userId)) {
        comment.likedBy.pull(userId); // Unlike if already liked
      } else {
        comment.likedBy.push(userId);
        comment.dislikedBy.pull(userId); // Remove dislike if liking
      }
    } else if (action === "dislike") {
      if (comment.dislikedBy.includes(userId)) {
        comment.dislikedBy.pull(userId); // Undislike if already disliked
      } else {
        comment.dislikedBy.push(userId);
        comment.likedBy.pull(userId); // Remove like if disliking
      }
    } else {
      return res.status(400).json({ 
        success: false, 
        msg: "Invalid action. Must be 'like' or 'dislike'" 
      });
    }

    await image.save();

    // Re-populate user to keep the UI consistent
    const updatedImage = await imageModel
      .findById(imageId)
      .populate("comments.user", "name image");

    return res.status(200).json({
      success: true,
      image: updatedImage,
    });
  } catch (error) {
    console.error("Like Comment Error:", error);
    return res.status(500).json({ 
      success: false, 
      msg: error.message 
    });
  }
};