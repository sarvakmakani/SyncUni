import mongoose, { Schema } from "mongoose";
const formResponseSchema = new Schema(
  {
    formId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Form',
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:Boolean,
        default:0
    }
  },
  { timestamps: true }
);

export const FormResponse = mongoose.model("FormResponse", formResponseSchema);
