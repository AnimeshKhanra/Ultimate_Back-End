import { Router } from "express"
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { 
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
} from "../controllers/comment.controller.js";




const router = Router();
// const commentRouter = Router();

router.use(verifyJwt);   // Apply verifyJWT middleware to all routes in this file
// commentRouter.use(verifyJwt);   // Apply verifyJWT middleware to all routes in this file

// routes
router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

// export default commentRouter;
export default router;