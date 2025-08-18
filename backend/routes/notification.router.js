const express = require("express");
const router = express.Router();
const {
  createNotification,
  getNotificationById,
  getNotifications,
  updateNotification,
  deleteNotification,
} = require("../controllers/admin/notification.controller");

router.post("/create", createNotification);
router.get("/get", getNotifications);
router.get("/get/:id", getNotificationById);
router.put("/update/:id", updateNotification);
router.delete("/delete/:id", deleteNotification);

module.exports = router;
