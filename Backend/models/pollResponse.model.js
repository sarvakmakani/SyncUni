import mongoose, { Schema } from "mongoose";
const pollResponseSchema = new Schema(
  {
    pollId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Poll',
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    optionIdx:{
        type:Number,
        default:-1
    }
  },
  { timestamps: true }
);

export const PollResponse = mongoose.model("PollResponse", pollResponseSchema);
