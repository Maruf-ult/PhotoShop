     import express from 'express';
import { deleteImage, deleteImageByUserId, getImageById, getImageByUserId, getImages, updateImage, uploadImage } from "../../controllers/imageModule.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import upload from "../../middlewares/uploadMiddleware.js";
     const router = express.Router();

     router.post("/upload-image",authMiddleware,upload.single("imageFile"),uploadImage);
     router.put("/:id",authMiddleware,updateImage);
     router.get("/images",getImages);
     router.get("/:id",authMiddleware,getImageById);
     router.delete("/:id",authMiddleware,deleteImage); 
     router.get("/myphotos/:userId",authMiddleware,getImageByUserId);
     router.delete("/myphotos/:userId",authMiddleware,deleteImageByUserId);

     export default router;
