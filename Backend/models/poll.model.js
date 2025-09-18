import mongoose, { Schema } from "mongoose";

const pollSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    deadline:{
        type:Date,
        required:true,
        validate: {
            validator: function(value) {
                return value.getTime() > Date.now();
            },
            message: "Deadline must be in the future"
        }
    },
    options:[{type:String,required:true}],
    voteCounts: {
      type: [Number],
      default: []  // one number per option
    },
    totalVotes: {
      type: Number,
      default: 0
    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
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

export const Poll = mongoose.model("Poll", pollSchema);
