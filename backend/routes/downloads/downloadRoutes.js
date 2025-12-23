import express from 'express'
import { AllDownloads, downloadPhoto,getAllDownloads,getDownloadHistory, getDownloadHistoryCount } from "../../controllers/downloadModule.js";
import authMiddleware from "../../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/download",authMiddleware,downloadPhoto);
router.get("/history",authMiddleware,getDownloadHistory);
router.get("/historycount/:id",authMiddleware,getDownloadHistoryCount);
router.get("/allhistorycount",authMiddleware,getAllDownloads);
router.get("/all-downloads",authMiddleware,AllDownloads);

export default router;