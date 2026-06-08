const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { uploadProfilePicture, getProfilePicture } = require("../controllers/adminController");

const profilePicDir = path.join(__dirname, "../uploads/profile_picture");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(profilePicDir)) {
      fs.mkdirSync(profilePicDir, { recursive: true });
    }
    cb(null, profilePicDir);
  },
  filename: (req, file, cb) => cb(null, `admin-profile-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

router.post("/profile-picture", upload.single("profilePicture"), uploadProfilePicture);
router.get("/profile-picture", getProfilePicture);

module.exports = router;
