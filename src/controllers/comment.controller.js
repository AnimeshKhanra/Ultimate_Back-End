import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponce } from "../utils/ApiResponce.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose";




const getVideoComments = asyncHandler(async (req, res) => {
        /*
        * take video id from params
        * set limit of videos 
        * check video id is valid or not
        * fetch comments from database
        * give the responce
        * 
        */
        
        const { videoId } = req.params;
        
        // Get pagination parameters from query (default: page 1, limit 10)
        const { page = 1, limit = 10 } = req.query;
    
        // Validate video ID
        if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
            throw new ApiError(400, "Valid video ID is required");
        }
    
        // Aggregation pipeline to match comments for the video, populate owner details, and sort by creation date
        const aggregate = Comment.aggregate([
            {
                $match: {
                    video: new mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $lookup: {
                    from: "users", // Reference the "users" collection
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                fullName: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    owner: { $first: "$owner" } // Extract the first (and only) owner object
                }
            },
            {
                $sort: { createdAt: -1 } // Sort comments by newest first
            }
        ]);
    
        // Pagination options
        const options = {
            page: parseInt(page),
            limit: parseInt(limit)
        };
    
        // Execute the paginated aggregation
        const result = await Comment.aggregatePaginate(aggregate, options);
    
        // Return the response with paginated comments
        return res.status(200).json(
            new ApiResponce(200, {
                comments: result.docs,
                totalComments: result.totalDocs,
                totalPages: result.totalPages,
                currentPage: result.page,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage
            }, "Comments fetched successfully")
        );
    });

const addComment = asyncHandler(async (req, res) => {
    // // Extract video ID from URL params and content from request body
    // const { videoId } = req.params;
    // const { content } = req.body;

    // // Validate inputs
    // if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    //     throw new ApiError(400, "Valid video ID is required");
    // }
    // if (!content || content.trim() === "") {
    //     throw new ApiError(400, "Comment content is required");
    // }

    // // Create and save the new comment
    // const comment = await Comment.create({
    //     content: content.trim(),
    //     video: videoId,
    //     owner: req.user._id  // Assumes auth middleware sets req.user
    // });

    // // Populate owner details for the response (optional, for immediate feedback)
    // const populatedComment = await Comment.findById(comment._id).populate("owner", "username fullName avatar");

    // // Return success response
    // return res.status(201).json(
    //     new ApiResponce(201, populatedComment, "Comment added successfully")
    // );
});

export {
    getVideoComments,
    addComment,
    
}
