import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";


const toggleVideoLike = asyncHandler(async (req, res) => {
    /*
     * 1. take videoId from params
     * 2. check validity
     * 3. take userId from auth middleware
     * 4. if exist like then unlike and return response
     * 5. if doesn't like then like and return response
     */

    const { videoId } = req.params;

    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Valid videoId required");
    }

    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(400, "Authentication required");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: userId,
    });

    if (existingLike) {
        await existingLike.deleteOne();

        return res
            .status(201)
            .json(new ApiResponce(201, null, "Video unliked successfully"));
    }

    const like = await Like.create({
        video: videoId,
        likedBy: userId,
    });

    return res.status(201).json(new ApiResponce(201, like, "Liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    /*
     * 1. take commentId from params
     * 2. check validity of commentId
     * 3. take userid and check authentication of user
     * 4. if comment like exist then unlike comment and return response
     * 5. if comment like dosen't exit then like the comment and return response
     */

    const { commentId } = req.params;
    if (!commentId && !mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Valid commentId required");
    }

    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(400, "You are not Authorized");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: userId,
    });

    if (existingLike) {
        await existingLike.deleteOne();

        return res
            .status(201)
            .json(new ApiResponce(201, null, "Comment unliked successfully"));
    }

    const like = await Like.create({
        comment: commentId,
        likedBy: userId,
    });

    return res
        .status(201)
        .json(new ApiError(201, like, "Comment liked successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    /*
     * 1. take tweetId from params
     * 2. check validity of tweetId
     * 3. take userid and check authentication of user
     * 4. if tweet like exist then unlike tweet and return response
     * 5. if tweet like dosen't exit then like the tweet and return response
     */

    const { tweetId } = req.params;
    if (!tweetId && !mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Valid tweetId required");
    }

    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(400, "You are not Authorized");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId,
    });

    if (existingLike) {
        await existingLike.deleteOne();
        return res
            .status(201)
            .json(new ApiResponce(201, null, "Tweet unliked successfully"));
    }

    const like = await Like.create({
        tweet: tweetId,
        likedBy: userId,
    });

    return res
        .status(201)
        .json(new ApiResponce(201, like, "Tweet liked successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {

    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(400, "You are not Authorized");
    }

    const { page = 1, limit = 10 } = req.query;
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(10, parseInt(limit, 10) || 10);

    const filter = {
        likedBy: userId,
        video: { $exists: true }
    }

    const totalLiked = await Like.countDocuments(filter);

    const likedVideos = await Like.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .populate({
            path: "video",
            populate: {
                path: "owner",
                select: "username fullName avatar"
            }
        })

    return res
        .status(201)
        .json(
            new ApiResponce(
                201,
                {
                    totalLiked,
                    page: pageNumber,
                    limit: pageSize,
                    likedVideos
                },
                "Liked video fetched successfully"
            )
        );


});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
