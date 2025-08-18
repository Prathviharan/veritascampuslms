const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const announcementSchema = new Schema(
  {
    title: { type: String },
    doneBy: { type: String },
    status: { type: String },
    message: { type: String },
    sendTo: { type: String },
  },
  { timestamps: true }
);

const Announcement = model("Announcement", announcementSchema);
module.exports = Announcement;
