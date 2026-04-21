import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { ApiError } from "../utils/ApiError.js";
import { PlayList } from "../models/playlist.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
    /*
     * 1. get name and description from body
     * 2. validate fields
     * 3. create playlist
     * 4. return response
     */

    const { name, description } = req.body;
    if (!name || name.trim() === "") {
        throw new ApiError(400, "Name is required");
    }
    if (!description || description.trim() === "") {
        throw new ApiError(400, "Playlist description is required");
    }

    const playlist = await PlayList.create({
        name: name,
        description: description,
        owner: req.user?._id,
    });
    // console.log(playlist);

    return res
        .status(201)
        .json(new ApiResponce(201, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    /**
     * 1. ger userid from params
     * 2. check validity of userid
     * 3. find playlist form db using userid
     * 4. return
     */
    const { userId } = req.params;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    const playlists = await PlayList.find({ owner: userId })
        .populate("video")
        .sort({ createdAt: -1 });
    console.log(playlists);

    if (!playlists) {
        throw new ApiError(400, "Not found any playlist");
    }

    return res
        .status(201)
        .json(new ApiError(201, playlists, "User playlist fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
    /**
     * 1. get playlistId from params & check validity
     * 2. find playlist by playlistId from db & check
     * 3. return
     */

    const { playlistId } = req.params;
    if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlistId");
    }

    const playlist = await PlayList.findById(playlistId)
        .populate("video", "title thumbnail duration")
        .populate("owner", "username fullname");

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(201)
        .json(new ApiResponce(201, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    /*
     * 1. get playlistId and videoId from params
     * 2. validate ids
     * 3. find playlist
     * 4. check ownership
     * 5. avoid duplicate video
     * 6. add video to playlist
     * 7. return response
     */
    const { playlistId, videoId } = req.params;
    if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(401, "valid playlistId required");
    }
    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(401, "valid videoId required");
    }

    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not allowed to add video");
    }

    // already existing video
    const existingVideo = playlist.video.some(
        (id) => id.toString() === videoId.toString()
    );

    if (existingVideo) {
        throw new ApiError(401, "Video already exist in playlist");
    }

    playlist.video.push(videoId);
    await playlist.save();

    const updatedPlaylist = await PlayList.findById(playlistId)
        .populate("video")
        .populate("owner", "username fullName avatar");

    return res
        .status(201)
        .json(
            new ApiError(201, updatePlaylist, "Add video in playlist successfully")
        );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    /*
     * 1. get playlistId and videoId from params & check
     * 2. find playlist
     * 3. check ownership
     * 4. check existing video
     * 5. remove video to playlist
     * 6. return res
     */

    const { playlistId, videoId } = req.params;
    if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(401, "valid playlistId required");
    }
    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(401, "valid videoId required");
    }

    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not allowed to add video");
    }

    //if video not exist
    const existVideo = playlist.video.some(
        (id) => id.toString() === videoId.toString()
    );

    if (!existVideo) {
        throw new ApiError(404, "Video is not found");
    }

    playlist.video = playlist.video.filter(
        (id) => id.toString() !== videoId.toString()
    );
    await playlist.save();

    const updatedPlaylist = await playlist
        .findById(playlistId)
        .populate("video")
        .populate("owner", "username fullname avatar");

    return res
        .status(200)
        .json(
            new ApiResponce(
                200,
                updatedPlaylist,
                "Video removed to playlist successfully"
            )
        );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    /*
     * 1. get playlistId from params
     * 2. validate playlistId
     * 3. find playlist
     * 4. check ownership
     * 5. delete playlist
     * 6. return response
     */

    const { playlistId } = req.params;
    if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete the playlist");
    }

    await PlayList.findByIdAndDelete(playlistId);

    return res
        .status(200)
        .json(new ApiResponce(200, {}, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    /*
     * 1. get playlistId from params
     * 2. get updated fields from body
     * 3. validate playlistId
     * 4. find playlist
     * 5. check ownership
     * 6. update fields
     * 7. save and return response
     */

    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlistId");
    }

    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You are not allowed to update playlist");
    }

    // Only run this block if the client actually sent name
    if (name && name.trim() !== "") {
        playlist.name = name.trim();
    }

    if (description && description.trim() !== "") {
        playlist.description = description.trim();
    }

    await playlist.save();

    const updatedPlaylist = await PlayList.findById(playlist)
        .populate("video")
        .populate("owner", "username fullName avatar");

    return res
        .status(201)
        .json(new ApiResponce(201, updatedPlaylist, "Playlist updated successfully"));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};
