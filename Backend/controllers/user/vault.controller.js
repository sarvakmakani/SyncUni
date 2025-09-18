import { asyncHandler } from "../../utils/asyncHandler.js";

import {Vault} from "../../models/vault.model.js"
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import mongoose from "mongoose";
import {uploadOnCloudinary} from "../../utils/cloudinary.js"
import cloudinary from "cloudinary"

const getDocuments = asyncHandler(async(req,res)=>{
    const userId=new mongoose.Types.ObjectId(req.user._id)
    const docs=await Vault.aggregate([
        {
            $match:{uploadedBy:userId}
        },
        {
            $project:{
                _id:1,
                document:1,
                name:1
            }
        }
    ])

    const docsWithSignedUrls = docs.map(doc => {
        const signedUrl = cloudinary.url(doc.document, { resource_type: "raw", type: "authenticated", sign_url: true, secure: true });
        return {
            _id: doc._id,
            name: doc.name,
            document: signedUrl,
        };
    });

    return res
    .json(
        new ApiResponse(200,docsWithSignedUrls,"documents fetched successfully")
    )
})

const addDocument = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const { name } = req.body;

  if (!req.file) throw new ApiError(401, "document not uploaded");

  // Pass both buffer + frontend-provided name
  const document = await uploadOnCloudinary(
    req.file.buffer,
    name,                    // 👈 use frontend name
    req.file.originalname    // 👈 keep extension from original
  );

  if (!document) throw new ApiError(400, "document upload failed");

  const addedDocument = await Vault.create({
    uploadedBy: userId,
    document: document.public_id,
    name: name
  });

  return res.json(
    new ApiResponse(201, addedDocument, "document added successfully")
  );
});


const deleteDocument = asyncHandler(async(req,res)=>{
    const documentId=new mongoose.Types.ObjectId(req.params.id)
    const document=await Vault.findByIdAndDelete(documentId)
    if(!document) return new ApiError(500,"document deletion failed")
    return res
    .json(
        new ApiResponse(201,{},"document deleted successfully")
    )
})


export {
    getDocuments,
    addDocument,
    deleteDocument
}