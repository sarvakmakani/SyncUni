import mongoose from "mongoose";
import { Event } from "../../models/event.model.js";
import { Form } from "../../models/form.model.js";
import { Poll } from "../../models/poll.model.js";
import { User } from "../../models/user.model.js";
import { Vault } from "../../models/vault.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

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
    })

    const events=await Event.find({
        $and: [
          { date: { $gt: new Date() } },
          {
            $or: [{ for: year_dept }, { for: "All" }],
          },
        ]
    })

    const valutItems=await Vault.find({uploadedBy:new mongoose.Types.ObjectId(req.user._id)})
    
    return res
    .json(
        new ApiResponse(
            200,{
                name:name,
                activeForms:forms.length,
                activePolls:polls.length,
                activeEvents:events.length,
                valutItems:valutItems.length,
                forms:recentForms
            },
            "cies fetched successfully"
        )
    )
})

export {
    getStatistics
}