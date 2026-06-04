const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const blogController = require('../controllers/blogController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/blogs';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
});

router.get('/', blogController.getAllBlogs);
router.post('/', upload.single('image'), blogController.createBlog);
router.put('/:id', upload.single('image'), blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
