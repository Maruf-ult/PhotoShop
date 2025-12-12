     import express from 'express'
     import {uploadImage,getImages,deleteImage,updateImage,getImageById} from "../../controllers/imageModule.js"
     import authMiddleware from "../../middlewares/authMiddleware.js";
     import upload from "../../middlewares/uploadMiddleware.js"
import { getImageByUserId } from '../../controllers/imageModule.js';
     const router = express.Router();

     router.post("/upload-image",authMiddleware,upload.single("imageFile"),uploadImage);
     router.put("/:id",authMiddleware,updateImage);
     router.post("/images",getImages);
     router.get("/:id",authMiddleware,getImageById);
     router.delete("/:id",authMiddleware,deleteImage); 
     router.get("/myphotos/:userId",authMiddleware,getImageByUserId);

     export default router;
