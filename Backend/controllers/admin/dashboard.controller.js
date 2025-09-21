import mongoose from "mongoose";
import { Event } from "../../models/event.model.js";
import { Form } from "../../models/form.model.js";
import { Poll } from "../../models/poll.model.js";
import { User } from "../../models/user.model.js";
import { Vault } from "../../models/vault.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

const getStatistics=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id)
    const name=user.name

    const forms=await Form.find(
      { deadline: { $gte: new Date() } },
    ).sort({ createdAt: -1 })

    const recentForms=forms.slice(0,3)

    const polls=await Poll.find(
      { deadline: { $gte: new Date() } },
    )

    const events=await Event.find(
      { date: { $gt: new Date() } },
    )

    const valutItems=await Vault.find({uploadedBy:new mongoose.Types.ObjectId(req.user._id)})
    
    return res
    .json(
        new ApiResponse(
            200,{
                name:name,
                formsCount:forms.length,
                pollsCount:polls.length,
                eventsCount:events.length,
                vaultItemsCount:valutItems.length,
                forms:recentForms
            },
            "statistics fetched successfully"
        )
    )
})

export {
    getStatistics
}