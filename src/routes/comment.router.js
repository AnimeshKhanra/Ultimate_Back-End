import { Router } from "express"
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { 
    getVideoComments,
    addComment,
    
} from "../controllers/comment.controller.js";




const router = Router();

router.use(verifyJwt);   // Apply verifyJWT middleware to all routes in this file

// routes
router.route("/:videoId").get(getVideoComments).post(addComment)


export default commentRouter;