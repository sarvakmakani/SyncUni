import mongoose from "mongoose";
import { Event } from "../../models/event.model.js";
import { Form } from "../../models/form.model.js";
import { Poll } from "../../models/poll.model.js";
import { User } from "../../models/user.model.js";
import { Vault } from "../../models/vault.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { Notification } from "../../models/notifications.model.js";

const getStatistics=asyncHandler(async(req,res)=>{
    const {idNo} =req.user
    
    const year_dept = idNo.slice(0,-3)
    const user=await User.findById(req.user._id)
    const name=user.name

    const forms=await Form.find({
        $and: [
          { deadline: { $gt: new Date() } },
          {
            $or: [{ for: year_dept }, { for: "All" }],
          },
        ]
    }).sort({ createdAt: -1 })

    const recentForms=forms.slice(0,3)

    const polls=await Poll.find({
        $and: [
          { deadline: { $gt: new Date() } },
          {
            $or: [{ for: year_dept }, { for: "All" }],
          },
        ]
    }).sort({createdAt:-1})

    const events=await Event.find({
        $and: [
          { date: { $gt: new Date() } },
          {
            $or: [{ for: year_dept }, { for: "All" }],
          },
        ]
    })

    const valutItems=await Vault.find({uploadedBy:new mongoose.Types.ObjectId(req.user._id)})

    const announcements=await Notification.aggregate([
      {
        $match:{
          $and: [
            { createdAt: { $lte: new Date() } },
            {
              $or: [{ for: year_dept }, { for: "All" }],
            },
          ]
        }
      }
    ])
    
    let date=new Date()
    let lastDate=new Date()
    lastDate.setDate(lastDate.getDate()+7)


    const formsDueThisWeek=await Form.countDocuments({
      deadline:{ $gte:date,$lte:lastDate }
    })    

    lastDate.setDate(date.getDate()+1)
    const pollsEndingSoon=await Poll.countDocuments({
      deadline:{ $gte:date,$lte:lastDate }
    })

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(date.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const newVaultItems=await Vault.countDocuments({
      createdAt:{ $gte:sevenDaysAgo,$lte:date }
    })

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayEvents = await Event.countDocuments({
        date: { $gte: todayStart, $lte: todayEnd }
    });

    return res
    .json(
        new ApiResponse(
            200,{
                name:name,
                activeForms:forms.length,
                activePolls:polls.length,
                polls:polls[0],
                activeEvents:events.length,
                valutItems:valutItems.length,
                forms:recentForms,
                announcements:announcements,
                formsDueThisWeek:formsDueThisWeek,
                pollsEndingSoon:pollsEndingSoon,
                todayEvents:todayEvents,
                newVaultItems:newVaultItems
            },
            "cies fetched successfully"
        )
    )
})

export {
    getStatistics
}