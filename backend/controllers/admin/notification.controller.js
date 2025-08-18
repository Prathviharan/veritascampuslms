const Notification = require("../../models/notification.model");

const createNotification = async (req, res) => {
  try {
    const { title, recipient, message } = req.body;
    const notification = new Notification({
      title,
      recipient,
      message,
    });

    const savedNotification = await notification.save();
    res
      .status(201)
      .json({
        status: "success",
        message: "Notification created successfully",
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json({ status: "success", data: notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res
        .status(404)
        .json({ status: "error", message: "Notification not found" });
    }

    res.status(200).json({ status: "success", data: notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNotification = async (req, res) => {
  try {
    const { title, recipient, message } = req.body;

    const updateNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      { title, recipient, message },
      { new: true }
    );
    res
      .status(200)
      .json({
        status: "success",
        message: "Notification updated successfully",
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({
        status: "success",
        message: "Notification deleted successfully",
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
};
