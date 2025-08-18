const Announcement = require("../../models/announcement.model");

const createAnnouncement = async (req, res) => {
  try {
    const { title, doneBy, status, message, sendTo } = req.body;
    const announcement = new Announcement({
      title,
      doneBy,
      status,
      message,
      sendTo,
    });

    await announcement.save();
    res.status(201).json({
      success:true,
      message: "Announcement created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const announcement = await Announcement.find();
    res.status(200).json({ status: "success", data: announcement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res
        .status(404)
        .json({ status: "error", message: "Announcement not found" });
    }

    res.status(200).json({ status: "success", data: announcement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { title, doneBy, status, message, sendTo } = req.body;

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, doneBy, status, message, sendTo },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "Announcement updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
};
