const express = require("express");
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/admin/announcement.controller");

router.post("/create", createAnnouncement);
router.get("/get", getAnnouncements);
router.get("/get/:id", getAnnouncementById);
router.put("/update/:id", updateAnnouncement);
router.delete("/delete/:id", deleteAnnouncement);

module.exports = router;
