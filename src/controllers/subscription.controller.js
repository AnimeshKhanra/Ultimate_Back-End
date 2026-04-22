import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user?._id;

    if (!channelId || !mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channelId");
    }
    if (!subscriberId || !mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new ApiError(400, "Unauthorized request");
    }

    // Prevent users from subscribing to themselves
    if (channelId.toString() === subscriberId.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    // check if channel exists
    const existingSubscription = await Subscription.findOne(
        {
            channel: channelId,
            subscriber: subscriberId
        }
    );

    if (existingSubscription) {
        // if subscription exists, then unsubscribe
        await Subscription.findByIdAndDelete(existingSubscription._id);
        return res
            .status(200)
            .json(new ApiResponce(true, { subscribed: true }, "Unsubscribed successfully"));
    } else {
        // if subscription does not exist, then subscribe
        const newSubscription = await Subscription.create({
            channel: channelId,
            subscriber: subscriberId
        });
        console.log("newSubscription", newSubscription);


        return res
            .status(200)
            .json(new ApiResponce(true, { subscribed: true }, "Subscribed successfully"));
    }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId || !mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channelId");
    }

    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized request");
    }

    if (channelId !== req.user._id.toString()) {
        throw new ApiError(403, "You cannot view subscribers of other channels");
    }

    const subscribers = await Subscription
        .find({ channel: channelId })
        .populate("subscriber", "fullName username email");

    return res.status(200).json(
        new ApiResponce(200, subscribers, "Subscribers fetched successfully")
    );
});


// const getUserChannelSubscribers = asyncHandler(async (req, res) => {
//     const { channelId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(channelId)) {
//         throw new ApiError(400, "Invalid channel id");
//     }

//     const subscribers = await Subscription.aggregate([
//         {
//             $match: {
//                 channel: new mongoose.Types.ObjectId(channelId);
//             }
//         },
//         {
//             $lookup: {
//                 from: "users",
//                 localField: "subscriber",
//                 foreignField: "_id",
//                 as: subscriber,
//                 pipeline: [
//                     {
//                         $project: {
//                             username: 1,
//                             fullName: 1,
//                             avatar: 1
//                         }
//                     }
//                 ]
//             }
//         },
//         {
//             $unwind: "$subscriber"
//         },
//         {
//             $project: {
//                 _id: 0,
//                 subscriber: 1,
//                 subscribedAt: "$createdAt"
//             }
//         }
//     ]);

//     return res.status(200).json(
//         new ApiResponce(
//             200,
//             subscribers,
//             "Channel subscribers fetched successfully"
//         )
//     );
// });













// controller to return channel list to which user has subscribed


const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    if (!subscriberId || !mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new ApiError(400, "Invalid subscriberId");
    }

    if(!req.user?._id) {
        throw new ApiError(401, "Unauthorized request");
    }

    if (subscriberId !== req.user._id.toString()) {
        throw new ApiError(403, "You cannot view subscribed channels of other users");
    }

    const subscribedChannels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "subscribedChannel"
            }
        },
        {
            $unwind: "$subscribedChannel"
        },
        {
            $project: {
                _id: 0,
                createdAt: 1,
                subscribedChannel: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1
                }
            }
        }
    ])

    return res
    .status(201)
    .json(new ApiResponce(201, subscribedChannels, "Subscribed channels fetched successfully"));

});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
};
