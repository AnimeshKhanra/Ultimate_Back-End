import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js"
import {
    toggleVideoLike,
    toggleCommentLike, 
    toggleTweetLike, 
    getLikedVideos
} from "../controllers/like.controller.js";




const router = Router();

router.use(verifyJwt)  // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);


export default router;