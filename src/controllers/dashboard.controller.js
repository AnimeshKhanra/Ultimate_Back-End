import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponce } from "../utils/ApiResponce.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user?._id;
    if (!channelId || !mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(401, "Unauthorized requst. Please login to access this resource.");
    }

    // Run queries concurrently for better performance
    const [videoStats, totalSubscribers, totalLikes] = await Promise.all([
        // 1. Get total videos and total views using aggregation
        Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(channelId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalVideos: { $sum: 1 },
                    totalViews: { $sum: "$views" }
                }
            }
        ]),

        // 2. Get total subscribers count
        Subscription.countDocuments({ channel: channelId }),

        // 3. Get total likes count for all videos of the channel
        Video.find({owner: channelId}, "_id").then(async (videos) => {
            const videoIds = videos.map(video => video._id);
            return Like.countDocuments({ video: { $in: videoIds } });
        })
    ]);

    const stats = {
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        totalSubscribers: totalSubscribers || 0,
        totalLikes: totalLikes || 0
    };

    return res.status(200).json(new ApiResponce(200, stats, "Channel stats fetched successfully"));
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.user?._id;
    if (!channelId || !mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(401, "Unauthorized request. Please login to access this resource.");
    }

    const videos = await Video.find({owner: channelId}).sort({ createdAt: -1 });
    console.log(videos);

    return res.status(200).json(new ApiResponce(200, videos, "Channel videos fetched successfully"));
})

export {
    getChannelStats,
    getChannelVideos
}