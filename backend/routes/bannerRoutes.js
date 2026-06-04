const express = require("express");
const router = express.Router();
const { getBanners, updateBanners, uploadBannerImage } = require("../controllers/bannerController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads/banners");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 } 
});

router.get("/hero-content", getBanners);
router.put("/hero-content", updateBanners);
router.post("/upload", upload.single("image"), uploadBannerImage);

module.exports = router;
