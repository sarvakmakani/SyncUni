import mongoose from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { Cie } from "../../models/cie.model.js";
import {User} from "../../models/user.model.js"
import { sendEmail } from "../../utils/email.js";

const addCie = asyncHandler(async(req,res)=>{
    const userId=new mongoose.Types.ObjectId(req.user._id)
    const {syllabus,subjectName,date,time,venue} = req.body
    let forWhom=req.body.for
    if(!syllabus || !subjectName || !date || !time || !venue) throw new ApiError(401,"provide all fields")
    if(!forWhom) forWhom="All"

    const cie=await Cie.create({
        uploadedBy:userId,
        syllabus:syllabus,
        subjectName:subjectName,
        date:new Date(date),
        time:time,
        venue:venue,
        for:forWhom
    })
    if (!cie) throw new ApiError(500, "CIE addition failed");

    let students = await User.find({},"email");
    
    if(forWhom!="All"){
        students = students.filter(student => student.email.startsWith(forWhom.toLowerCase()));
    }

    students.forEach(student => {
      sendEmail(
        student.email,
        "New CIE Added",
        `Dear Student, new CIE have been published. Please check the portal.`
      ).catch(err => console.error("Email failed:", err));
    });

    return res.json(
        new ApiResponse(201,cie,"cie added successfully")
    )
})

const updateCie = asyncHandler(async(req,res)=>{
    const {syllabus,subjectName,date,time,venue} = req.body
    const forWhom=req.body.for

    let matchedStage={}
    if(syllabus) matchedStage.syllabus=syllabus
    if(subjectName) matchedStage.subjectName=subjectName
    if(date) matchedStage.date= new Date(date)
    if(time) matchedStage.time=time
    if(venue) matchedStage.venue=venue
    if(forWhom) matchedStage.for=forWhom

    const {id}=req.params
    const cie=await Cie.findByIdAndUpdate(id,matchedStage,{new:true})
    
    if (!cie) throw new ApiError(404, "CIE not found");

    return res.json(
        new ApiResponse(200,cie,"cie updated successfully")
    )
})

const getCies = asyncHandler(async(req,res)=>{
    const userId=new mongoose.Types.ObjectId(req.user._id)

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


    const result=await Cie.aggregate([
        {
            $facet:{
                myCies:[
                    { $match:{ uploadedBy:userId } },
                    userLookup,
                    {$unwind:'$uploadedBy'},
                ],
                pastCies:[
                    { $match:{ date: { $lt: new Date() } } },
                    userLookup,
                    {$unwind:'$uploadedBy'},
                ],
                upcomingCies:[
                    { $match:{ date: { $gte: new Date() } } },
                    userLookup,
                    {$unwind:'$uploadedBy'},
                ]
            }
        }
    ])
    
    return res.json(
        new ApiResponse(200,result[0],"cies fetched successfully")
    )
})

const deleteCie=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const cie=await Cie.findById(id)
    if(!cie) throw new ApiError(404,"no cie found")
    
    await Cie.findByIdAndDelete(id)
    return res.json(
        new ApiResponse(200,{},"cie deleted")
    )
})

export {
    addCie,
    updateCie,
    getCies,
    deleteCie
}
