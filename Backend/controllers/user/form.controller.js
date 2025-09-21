import { asyncHandler } from "../../utils/asyncHandler.js";

import {Form} from "../../models/form.model.js"
import {FormResponse} from "../../models/formResponse.model.js"
import ApiResponse from "../../utils/ApiResponse.js";

const getForms = asyncHandler(async (req, res) => {
  const { idNo } = req.user;
  const year_dept = idNo.slice(0, -3);

  
    const userLookup = {
        $lookup: {
            from: "users",
            localField: "uploadedBy",
            foreignField: "_id",
            as: "uploadedBy",
            pipeline: [
                {
                    $project: {
                        name: 1,
                        email: 1,
                        avatar: 1,
                        _id: 0,
                    },
                },
            ],
        },
    }

  let forms = await Form.aggregate([
    {
      $match: {
        $and: [
          { deadline: { $gte: new Date() } },
          {
            $or: [{ for: year_dept }, { for: "All" }],
          },
        ],
      },
    },
    userLookup,
    {$unwind:'$uploadedBy'},
    {
      $project: {
        responseLink:0,
        for: 0,
        __v: 0,
      },
    },
  ]);

  // // attach submission status for each form
  // const formsWithStatus = await Promise.all(
  //   forms.map(async (form) => {
  //     const submitted = await FormResponse.findOne({
  //       formId: form._id,
  //       userId: req.user._id,
  //     });
  //     return {
  //       ...form,
  //       alreadySubmitted: !!submitted, // true if found
  //     };
  //   })
  // );

  return res.json(
    new ApiResponse(200, forms, "forms fetched successfully")
  );
});


export {
    getForms
}