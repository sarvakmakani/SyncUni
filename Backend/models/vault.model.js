import mongoose, { Schema } from "mongoose";

const vaultSchema = new Schema(
  {
    uploadedBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true
    },
    document:{
      type:String,
      required:true
    },
    name:{
      type:String,
      required:true
    }
  },
  { timestamps: true }
);

export const Vault = mongoose.model("Vault", vaultSchema);
