import express from 'express'
import {addComment,likeComment} from '../../controllers/commentModule.js'
import authMiddleware from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/add-comment",authMiddleware,addComment);
router.post("/like-comment",authMiddleware,likeComment);

export default router;