import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";


const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query = "",
        sortBy = "createdAt",
        sortType = "desc",
        userId,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const sortOrder = sortType === "asc" ? 1 : -1;

    const match = {
        isPublished: true,
    };

    if (query.trim()) {
        const regex = new RegExp(query, "i");

        match.$or = [
            { title: regex },
            { description: regex }
        ];
    }

    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid userId");
        }

        match.owner = new mongoose.Types.ObjectId(userId);
    }

    const aggregate = Video.aggregate([
        { $match: match },

        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },

        {
            $addFields: {
                owner: { $first: "$owner" },
            },
        },

        {
            $sort: {
                [sortBy]: sortOrder,
            },
        },
    ]);

    const options = {
        page: pageNumber,
        limit: limitNumber,
    };

    const videos = await Video.aggregatePaginate(aggregate, options);

    return res.status(200).json(
        new ApiResponce(200, videos, "Videos fetched successfully")
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    /*
     * 1. take title, description from user
     * 2. check validity of both
     * 3. get video file and thumbnail from req.file
     * 4. upload video to cloudinary and get durarion
     * 5. upload thumbnail to cloudinary
     * 6. create video document in DB
     * 7. return response
     */

    const { title, description } = req.body;

    if (!title && title.trim() === "") {
        throw new ApiError(400, "Title is required");
    }

    if (!description && description.trim() === "") {
        throw new ApiError(400, "Description is required");
    }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoFileLocalPath) {
        throw new ApiError(400, "Video is required");
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile) {
        throw new ApiError(400, "Failed to upload video file");
    }

    if (!thumbnail) {
        throw new ApiError(400, "Failed to upload thumbnail");
    }

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title: title.trim(),
        description: description.trim(),
        duration: videoFile.duration || 0,
        owner: req.user._id,
    });

    return res
        .status(201)
        .json(new ApiResponce(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    /*
     *  1. get videoid using req.params
     *  2. check validity of videoId
     *  3. get video using videoId from DB
     *  4. Return response
     */
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video Id");
    }

    const video = await Video.findById(videoId).populate(
        "owner",
        "username fullName avatar"
    );

    if (!video) {
        throw new ApiError(404, "Vido not found");
    }

    return res
        .status(200)
        .json(new ApiResponce(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    /*
     * 1. get videoId from req.params
     * 2. check validity of videoId
     * 3. take video details from db
     * 4. update video details
     * 5. save this
     * 6. return response
     */

    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Video Id is not valid");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(400, "Video not found");
    }

    //! ensure only the owner can update
    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }

    const { title, description } = req.body;

    // Only run this block if the client actually sent title
    if (title !== undefined) {
        if (!title.trim()) {
            throw new ApiError(400, "Title cannot be empty");
        }
        video.title = title.trim();
    }

    // Only run this block if the client actually sent description
    if (description !== undefined) {
        if (!description.trim()) {
            throw new ApiError(400, "Description cannot be empty");
        }
        video.description = description.trim();
    }

    // const thumbnailLocalPath  = req.files?.thumbnail?.[0]?.path;
    const thumbnailLocalPath = req.file?.path;
    if (thumbnailLocalPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        if (!thumbnail) {
            throw new ApiError(400, "Failed to upload thumbnail");
        }
        video.thumbnail = thumbnail.url;
    }

    await video.save();

    return res
        .status(200)
        .json(new ApiResponce(200, video, "Updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    /*
     *  1. take videoId from params
     *  2. check validate of videoId
     *  3. select video from db using videoId
     *  4. check authority
     *  5. delete video
     *  6. return response
     */

    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "VideoId is not valid");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video");
    }

    await Video.findByIdAndDelete(videoId);

    return res
        .status(200)
        .json(new ApiResponce(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    /*
     * 1. get videoId from params
     * 2. check validity of videoId
     * 3. get video from database
     * 4. check authority (only owner can toggle)
     * 5. toggle isPublished status
     * 6. save the video
     * 7. return response
     */

    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "VideoId is not Valid");
    }

    const video = await Video.findById(videoId);
    // console.log("Your video is: ", video);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to toggle published video");
    }

    // toggle published video
    video.isPublished = !video.isPublished;
    await video.save();

    return res
        .status(200)
        .json(
            new ApiResponce(
                200,
                video,
                `Video ${video.isPublished ? "published" : "unpublished"} successfully`
            )
        );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};
