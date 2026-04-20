import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose from "mongoose";

const createTweet = asyncHandler(async (req, res) => {
    /*
     *  1. take content from user
     *  2. check about content
     *  3. create object of in db
     *  4. return response
     */

    const { content } = req.body;

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");
    }

    const tweet = await Tweet.create({
        content: content.trim(),
        owner: req.user?._id,
    });

    return res
        .status(201)
        .json(new ApiResponce(201, tweet, "Tweet successfully added"));
});

const getUserTweets = asyncHandler(async (req, res) => {
    /*
     *  1. get user id from params
     *  2. find all tweets of that user
     *  3. return tweets
     *  4. return response
     */

    const { userId } = req.params;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Valid userId is required");
    }

    const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });
    // console.log(tweets);
    if (!tweets || tweets.length === 0) {
        throw new ApiError(401, "No tweet found for user");
    }

    return res
        .status(200)
        .json(new ApiResponce(200, tweets, "All tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
    /*
     * 1. get tweet id from params
     * 2. get updated content from body
     * 3. validate inputs
     * 4. check tweet exists
     * 5. check ownership
     * 6. update tweet
     * 7. return response
     */

    const { tweetId } = req.params;
    const { content } = req.body;

    if (!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(400, "Tweet not found");
    }

    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this tweet");
    }

    tweet.content = content.trim();
    await tweet.save();

    return res
        .status(201)
        .json(new ApiResponce(201, tweet, "Tweet update successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
/*
* 1. get tweet id from params
* 2. validate tweet id
* 3. find tweet
* 4. check ownership
* 5. delete tweet
* 6. return response
*/

    const { tweetId } = req.params;
    if (!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet is not found");
    }

    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(401, "You are not allowed to delete the tweet");
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res
        .status(201)
        .json(new ApiResponce(201, {}, "Tweet delete successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
