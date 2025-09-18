import mongoose from "mongoose"
import { Notification } from "../../models/notifications.model.js"
import { UserNotification } from "../../models/userNotification.model.js"
import ApiError from "../../utils/ApiError.js"
import ApiResponse from "../../utils/ApiResponse.js"
import { asyncHandler } from "../../utils/asyncHandler.js"

const getNotifications=asyncHandler(async(req,res)=>{
    
    const { idNo } = req.user;
    const year_dept = idNo.slice(0, -3);

    const notifications=await Notification.find({
        $or:[{for:year_dept},{for:"All"}]
    }).select("-for").lean()
    
    const userNotification=await UserNotification.find({
        user:new mongoose.Types.ObjectId(req.user._id)
    })
    const notificationIds=userNotification.map(notification=>notification.notification._id.toString())

    const notificationsWithMark= notifications
        .map(notification=>{
            const isRead=notificationIds.includes(notification._id.toString())
      
            return {
                ...notification,
                isRead: !!isRead
            }
        })

    return res.json(
        new ApiResponse(200,notificationsWithMark,"notification fetched successfully")
    )
})

const markRead=asyncHandler(async(req,res)=>{

    const notificationId=req.params.id
    const userId=req.user._id

    await UserNotification.create({
        user:userId,
        notification:notificationId,
    })

    return res.json(
        new ApiResponse(200,{},"notification marked as read successfully")
    )
})

export{
    getNotifications,
    markRead
}