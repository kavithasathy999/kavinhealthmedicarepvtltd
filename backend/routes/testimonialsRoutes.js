const express = require("express");
const router = express.Router();
const testimonialsController = require("../controllers/testimonialsController");

router.get("/", testimonialsController.getAllTestimonials);
router.post("/", testimonialsController.createTestimonial);
router.put("/:id", testimonialsController.updateTestimonial);
router.delete("/:id", testimonialsController.deleteTestimonial);

module.exports = router;