import { Notification } from "../../models/notifications.model.js"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js"
import { asyncHandler } from "../../utils/asyncHandler.js"

const addNotification=asyncHandler(async(req,res)=>{
    const {title,description}=req.body
    const forWhom= req.body.for ?? "All"

    if(!title || !description) throw new ApiError(400,"title and description are required")

    const notification=await Notification.create({
        title,
        description,
        forWhom
    })
    if(!notification) throw new ApiError(500,"notification creation failed")

    return res.status(201).json(
        new ApiResponse(201,{},"notification created successfully")
    )
})

export{
    addNotification
}