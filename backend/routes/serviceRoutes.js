const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const serviceController = require('../controllers/serviceController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'service-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), serviceController.addService);
router.get('/', serviceController.getServices);
router.delete('/:id', serviceController.deleteService);
router.put('/:id', upload.single('image'), serviceController.updateService);

module.exports = router;
