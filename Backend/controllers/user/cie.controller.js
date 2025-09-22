import { asyncHandler } from "../../utils/asyncHandler.js";

import {Cie} from "../../models/cie.model.js"
import ApiResponse from "../../utils/ApiResponse.js";

const getCies = asyncHandler(async(req,res)=>{
    const {idNo} =req.user
    
    const year_dept = idNo.slice(0,-3)

    let cies=await Cie.aggregate([
        {
            $match:{
                $and: [
                    { date: { $gte: new Date() } }, 
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
            $lookup:{
                from:'users',
                localField:'uploadedBy',
                foreignField:'_id',
                as:'uploadedBy',
                pipeline:[{
                    $project:{
                        name:1,
                        email:1,
                        avatar:1,
                        _id:0
                    }
                }]
            }
        },
        {$unwind:'$uploadedBy'},
        {
            $project:{
                for:0,
                __v:0,
                _id:0,
                createdAt:0,
                updatedAt:0
            }
        }
    ])
    
    console.log(cies);
    
    return res
    .json(
        new ApiResponse(200,cies,"cies fetched successfully")
    )
})

export {
    getCies
}
