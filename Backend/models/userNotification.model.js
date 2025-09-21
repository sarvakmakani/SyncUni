// UserNotification.js
import mongoose, { Schema } from "mongoose";

const userNotificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    notification: { type: Schema.Types.ObjectId, ref: "Notification", required: true },
    isRead: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const UserNotification = mongoose.model("UserNotification", userNotificationSchema);
