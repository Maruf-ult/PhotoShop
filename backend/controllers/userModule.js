import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/users.js";

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      image,
    });

    await newUser.save();

    const jwtToken = jwt.sign(
      { userId: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      success: true,
      token: jwtToken,
      msg: `Welcome ${name}!`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        image: newUser.image,
        isAdmin: newUser.isAdmin, 
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: `Internal server error: ${error.message}` });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: "Invalid password" });
    }

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

 return res.status(200).json({
  success: true,
  msg: `Welcome back ${user.name}`,
  token: jwtToken,
  user: { 
    id: user._id, 
    name: user.name, 
    email: user.email, 
    image: user.image,
    isAdmin: user.isAdmin   // <-- ADD THIS
  },
});

  } catch (error) {
    return res.status(500).json({ success: false, msg: `Internal server error: ${error.message}` });
  }
};


export const userInfo = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error getting user info" });
  }
};



// Get User By ID
export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    return res.status(200).json({ success: true, msg: "User found", user });
  } catch (error) {
    return res.status(500).json({ success: false, msg: `Internal server error: ${error.message}` });
  }
};

// Update User By ID
export const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = { ...req.body };

    // If password is being updated, hash it again
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    return res.status(200).json({
      success: true,
      msg: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: `Internal server error: ${error.message}` });
  }
};