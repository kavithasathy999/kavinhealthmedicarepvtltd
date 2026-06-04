const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

router.get("/", statsController.getAllStats);
router.put("/:id", statsController.updateStat);
router.delete("/:id", statsController.deleteStat);

module.exports = router;