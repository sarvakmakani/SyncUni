import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js"
import { Poll } from "../../models/poll.model.js";
import mongoose from "mongoose";

const addPoll = asyncHandler(async(req,res)=>{
    const {name,deadline,options,for:forWhom}=req.body
    if(!name || !deadline || options.length==0) throw new ApiError(401,"provide all details")
    if(!forWhom) forWhom="All"

    const poll=await Poll.create({
        name,
        deadline:new Date(deadline),
        options,
        userId,
        forWhom
    })
    if(!poll) throw new ApiError(500,"Poll creating failed")
    
    return res.json(
        new ApiResponse(201,poll,"poll added successfully")
    )
    
})

const updatePoll = asyncHandler(async(req,res)=>{
    const {name,deadline,options,for:forWhom}=req.body
    const {id}=req.params

    let matchedStage={}
    if(name) matchedStage.name=name
    if(options) matchedStage.options=options
    if(deadline) matchedStage.deadline= new Date(deadline)
    if(forWhom) matchedStage.for=forWhom

    const poll=await Poll.findByIdAndUpdate(id,matchedStage,{new:true})
    if(!poll) throw new ApiError(404,"Poll not found")

    return res.json(
        new ApiResponse(200,poll,"poll updated successfully")
    )
})


const getPolls = asyncHandler(async(req,res)=>{
    const userId=new mongoose.Types.ObjectId(req.user._id)

    const withStatsProjection = {
        $project: {
            name: 1,
            deadline: 1,
            options: 1,
            for: 1,
            totalVotes: 1,
            voteCounts: 1,
        }
    }
    
    const result=await Poll.aggregate([
        {
            $facet:{
                myPolls:[
                    {
                        $match: {uploadedBy:userId}
                    },
                    withStatsProjection
                ],
                pastPolls:[
                    {
                        $match: { deadline:{ $lt:new Date() } }
                    },
                    withStatsProjection
                ],
                upcomingPolls:[
                    {
                        $match: { deadline:{ $gt:new Date() } }
                    },
                    withStatsProjection
                ],
            }
        }
    ])

    return res.json(
        new ApiResponse(200,result[0],"poll fetched successfully")
    )
})


export {
    addPoll,
    updatePoll,
    getPolls
}