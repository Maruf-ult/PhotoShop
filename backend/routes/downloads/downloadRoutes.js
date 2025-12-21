import express from 'express'
import { downloadPhoto,getDownloadHistory, getDownloadHistoryCount } from "../../controllers/downloadModule.js";
import authMiddleware from "../../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/download",authMiddleware,downloadPhoto);
router.get("/history",authMiddleware,getDownloadHistory);
router.get("/historycount/:id",authMiddleware,getDownloadHistoryCount);

export default router;