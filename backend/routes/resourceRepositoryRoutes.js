const express = require("express");
const router = express.Router();
const resourceRepositoryController = require("../controllers/resourceRepositoryController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(null, true);
        }
    }
});

router.get("/", resourceRepositoryController.getResourceRepository);
router.post("/", upload.single("pdf"), resourceRepositoryController.addResourceRepository);
router.put("/:id", upload.single("pdf"), resourceRepositoryController.updateResourceRepository);
router.delete("/:id", resourceRepositoryController.deleteResourceRepository);

module.exports = router;
