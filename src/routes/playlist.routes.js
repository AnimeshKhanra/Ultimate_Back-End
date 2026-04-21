import { Router } from "express"
import { verifyJwt } from "../middlewares/auth.middlewares.js"
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js"


const router = Router();

router.use(verifyJwt);


router.route("/").post(createPlaylist);

router.route("/:playlistId")
.get(getPlaylistById)
.patch(updatePlaylist)
.delete(deletePlaylist);

router.route("/:playlistId/add/:videoId").patch(addVideoToPlaylist);
router.route("/:playlistId/remove/:videoId").patch(removeVideoFromPlaylist);

router.route("/user/:userId").get(getUserPlaylists);

export default router;