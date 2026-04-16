import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    deleteVideo,
    updateVideo,
    togglePublishStatus,
} from "../controllers/video.controller.js";

const router = Router();

router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

// routes
router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router
    .route("/toggle/publish/:videoId")
    .patch(togglePublishStatus)


export default router;
