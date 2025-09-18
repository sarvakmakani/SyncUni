import { asyncHandler } from "../../utils/asyncHandler.js";

import {Poll} from "../../models/poll.model.js"
import {PollResponse} from "../../models/pollResponse.model.js"
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import mongoose from "mongoose";

const getPolls = asyncHandler(async (req, res) => {
  const { idNo } = req.user;
  const  userId = new mongoose.Types.ObjectId(req.user._id);
  const year_dept = idNo.slice(0, -3);
  console.log(year_dept);

  let polls = await Poll.aggregate([
    {
      $match: {
        $and: [
          { deadline: { $gt: new Date() } },
          {
            $or: [
              { for: year_dept },
              { for: "All" }
            ]
          }
        ]
      }
    },
    {
      $lookup: {
        from: "pollresponses",          // collection name
        let: { pollId: "$_id" },        // current poll _id
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$pollId", "$$pollId"] },    // match poll
                  { $eq: ["$userId", userId] }  // match current user
                ]
              }
            }
          },
          { $limit: 1 } // we only need to know if exists
        ],
        as: "userVote"
      }
    },
    {
      $addFields: {
        alreadyVoted: { $gt: [{ $size: "$userVote" }, 0] } // true if userVote array has entries
      }
    },
    {
      $project: {
        name: 1,
        deadline: 1,
        options: 1,
        _id: 1,
        alreadyVoted:1,
        voteCounts:1
      }
    }
  ]);
  
  return res.json(
    new ApiResponse(200, polls, "polls fetched successfully")
  );
});


const votePoll = asyncHandler(async(req,res)=>{
    const optionIdx=Number(req.body.option)
    const id=new mongoose.Types.ObjectId(req.params.id)
    const userId=new mongoose.Types.ObjectId(req.user._id)

    let poll=await Poll.findById(id)
    if(!poll) throw new ApiError(404,"poll not found")

    if(optionIdx>=poll.options.length || optionIdx<0) return ApiError(401,"invalid option index")

    const existingVote = await PollResponse.findOne({ pollId: id, userId:userId });
    if (existingVote) throw new ApiError(400, "User has already voted on this poll");

    const vote=await PollResponse.create({
        pollId:id,
        userId:userId,
        optionIdx:optionIdx
    })    
    if(!vote) throw new ApiError(500,"failed to vote")
    
    await Poll.findByIdAndUpdate(id, {
      $inc: { 
        [`voteCounts.${optionIdx}`]: 1, // increment option count
        totalVotes: 1                   // increment total votes
      }
    });
    

    return res
    .json(
        new ApiResponse(200,vote,"voted successfully")
    )
})

export {
    getPolls,
    votePoll
}