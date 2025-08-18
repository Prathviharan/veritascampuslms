const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const notificationSchema = new Schema(
  {
    title: { type: String },
    recipient: { type: String },
    message: { type: String },
  },
  { timestamps: true }
);

const Notification = model("Notification", notificationSchema);
module.exports = Notification;
