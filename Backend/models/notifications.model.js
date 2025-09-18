import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {   
      type: String,
      trim: true,
      required:true
    },
    for:{
      type:String,
      enum:["22DCE","22DCSE","22DIT","23DCE","23DCSE","23DIT","24DCE","24DCSE","24DIT","25DCE","25DCSE","25DIT","All"],
      default:"All"
    }
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
