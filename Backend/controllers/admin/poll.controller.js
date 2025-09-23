import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js"
import { Poll } from "../../models/poll.model.js";
import mongoose from "mongoose"
import ApiResponse from "../../utils/ApiResponse.js";

const addPoll = asyncHandler(async(req,res)=>{
    const {name,deadline,options,for:forWhom}=req.body
    if(!name || !deadline || options.length==0) throw new ApiError(401,"provide all details")
    if(!forWhom) forWhom="All"
    const userId=new mongoose.Types.ObjectId(req.user._id)

    const poll=await Poll.create({
        name:name,
        deadline:new Date(deadline),
        options:options,
        uploadedBy:userId,
        for:forWhom
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
            updatedAt:1,
            uploadedBy:1
        }
    }

    const userLookup = {
        $lookup: {
            from: "users",
            localField: "uploadedBy",
            foreignField: "_id",
            as: "uploadedBy",
            pipeline: [
                {
                    $project: {
                        name: 1,
                        email: 1,
                        avatar: 1,
                        _id: 0,
                    },
                },
            ],
        },
    }
    
    const result=await Poll.aggregate([
        {
            $facet:{
                myPolls:[
                    {
                        $match: {uploadedBy:userId}
                    },
                    userLookup,
                    {$unwind:'$uploadedBy'},
                    withStatsProjection
                ],
                pastPolls:[
                    {
                        $match: { deadline:{ $lt:new Date() } }
                    },
                    userLookup,
                    {$unwind:'$uploadedBy'},
                    withStatsProjection
                ],
                upcomingPolls:[
                    {
                        $match: { deadline:{ $gte:new Date() } }
                    },
                    userLookup,
                    {$unwind:'$uploadedBy'},
                    withStatsProjection
                ],
            }
        }
    ])

    console.log(result[0].myPolls);
    

    return res.json(
        new ApiResponse(200,result[0],"poll fetched successfully")
    )
})

const deletePoll=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const poll=await Poll.findById(id)
    if(!poll) throw new ApiError(404,"poll not found")
    
    await Poll.findByIdAndDelete(id)
    return res.json(
        new ApiResponse(200,"poll deleted successfully")
    )
})

export {
    addPoll,
    updatePoll,
    getPolls,
    deletePoll
}