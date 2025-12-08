import express from 'express'
import { downloadPhoto,getDownloadHistory } from "../../controllers/downloadModule.js";
import authMiddleware from "../../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/download",authMiddleware,downloadPhoto);
router.get("/history",authMiddleware,getDownloadHistory);

export default router;