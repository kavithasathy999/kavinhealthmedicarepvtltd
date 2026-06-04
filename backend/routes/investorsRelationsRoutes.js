const express = require("express");
const router = express.Router();
const investorsRelationsController = require("../controllers/investorsRelationsController");
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

router.get("/", investorsRelationsController.getInvestorsRelations);
router.post("/", upload.single("pdf"), investorsRelationsController.addInvestorRelation);
router.put("/:id", upload.single("pdf"), investorsRelationsController.updateInvestorRelation);
router.delete("/:id", investorsRelationsController.deleteInvestorRelation);

module.exports = router;
