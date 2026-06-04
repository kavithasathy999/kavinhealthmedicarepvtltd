const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { getBrands, uploadBrand, deleteBrand, updateBrand } = require("../controllers/brandsController");

const uploadDir = path.join(__dirname, "..", "uploads", "brands");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

router.get("/", getBrands);
router.post("/", upload.single("image"), uploadBrand);
router.delete("/:id", deleteBrand);
router.put("/:id", upload.single("image"), updateBrand);

module.exports = router;
