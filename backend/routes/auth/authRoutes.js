import express from 'express';
import { deleteUserById, getAllUser, getUserById, login, register, updateUserById, userInfo } from '../../controllers/userModule.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import upload from '../../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post("/register",upload.single("image"),register);
router.post("/login",login);
router.get("/profile",authMiddleware,userInfo);
router.get("/users",authMiddleware,getAllUser);
router.get("/:id",authMiddleware,getUserById);
router.put("/:id",authMiddleware,upload.single("image"),updateUserById);
router.delete("/:id",authMiddleware,deleteUserById);


export default router;