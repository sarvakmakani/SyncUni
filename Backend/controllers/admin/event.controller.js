import mongoose from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Event } from "../../models/event.model.js";
import ApiResponse from "../../utils/ApiResponse.js";

const addEvent = asyncHandler(async(req,res)=>{
    const {name,description,date,time,venue,for:forWhom}=req.body
    const userId=new mongoose.Types.ObjectId(req.user._id)

    if(!name || !description || !date || !time || !venue) throw new ApiError(401,"provide all fields")
    if(!forWhom) forWhom="All"

    const event=await Event.create({
        name,
        description,
        date:new Date(date),
        time,
        venue,
        userId,
        forWhom
    })
    if (!event) throw new ApiError(500, "EVENT addition failed");

    return res.json(
        new ApiResponse(201,event,"event added successfully")
    )
})

const updateEvent = asyncHandler(async(req,res)=>{
    const {name,description,date,time,venue,for:forWhom}=req.body
    const {id}=req.params

    let matchedStage={}
    if(name) matchedStage.name=name
    if(description) matchedStage.description=description
    if(date) matchedStage.date= new Date(date)
    if(time) matchedStage.time=time
    if(venue) matchedStage.venue=venue
    if(forWhom) matchedStage.for=forWhom

    const event=await Event.findByIdAndUpdate(id,matchedStage,{new:true})
    if (!event) throw new ApiError(404, "EVENT not found");

    return res.json(
        new ApiResponse(201,event,"event updated successfully")
    )
})

const getEvents = asyncHandler(async(req,res)=>{
    
    const eventProjection={
        $project:{
            uploadedBy:0,
            for:0,
            __v:0,
            _id:0
        }
    }

    const result=await Event.aggregate([
        {
            $facet:{
                pastEvents:[
                    { $match:{ date: { $lt: new Date() } }, },
                    eventProjection
                ],
                upcomingEvents:[
                    { $match:{ date: { $gt: new Date() } }, },
                    eventProjection
                ],
            }
        }
    ])
    return res
    .json(
        new ApiResponse(200,result[0],"events fetched successfully")
    )
})

export {
    addEvent,
    updateEvent,
    getEvents
}