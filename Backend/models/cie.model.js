import mongoose, { Schema } from "mongoose";

const CieSchema = new Schema(
  {
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    description: {   
      type: String,
      trim: true,
      required:true
    },
    date:{
        type:Date,
        required:true,
        validate: {
            validator: function(value) {
                return value.getTime() > Date.now();
            },
            message: "Deadline must be in the future"
        }
    },
    time:{
        type:String,
        required:true
    },
    venue:{
        type: String,
        required: true,
        trim: true
    },
    for:{
      type:String,
      enum:["22DCE","22DCSE","22DIT","23DCE","23DCSE","23DIT","24DCE","24DCSE","24DIT","25DCE","25DCSE","25DIT","All"],
      default:"All"
    }
  },
  { timestamps: true }
);

export const Cie = mongoose.model("Cie", CieSchema);
