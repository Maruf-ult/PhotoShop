import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  text: {
    type: String,
    required: true,
    max: [200, "Not more than 200 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  // Track users who liked this comment
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    default: []
  }],
  // Track users who disliked this comment
  dislikedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    default: []
  }],
  // Keep this for backward compatibility if needed
  likes: {
    type: Number,
    default: 0,
  },
});

const ImageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    views: {
    type: Number,
    default: 0,
  },
    title: {
      type: String,
      required: true,
      max: [40, "Not more 40 character"],
    },
    description: {
      type: String,
      required: true,
      max: [400, "Not more than 400 character"],
    },
    category:{
       type:String,
       required:true,
    },
    tags: {
      type: Array,
      required: true,
      default: [],
    },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

const imageModel = mongoose.model("Images", ImageSchema);
export default imageModel;
