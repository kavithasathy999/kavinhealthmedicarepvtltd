const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const careerController = require('../controllers/careerController');

const appUploadDir = path.join(__dirname, '../uploads/applications');
if (!fs.existsSync(appUploadDir)) {
  fs.mkdirSync(appUploadDir, { recursive: true });
}

const appStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, appUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'app-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const appFileFilter = (req, file, cb) => {
  if (file.fieldname === 'photo') {
    const allowed = /jpeg|jpg|png|gif|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for photo'));
    }
  } else if (file.fieldname === 'resume') {
    const allowed = /pdf|doc|docx/;
    cb(null, true); 
  } else {
    cb(null, true);
  }
};

const appUpload = multer({
  storage: appStorage,
  fileFilter: appFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

router.get('/', careerController.getOpportunities);                   
router.post('/apply', appUpload.fields([{ name: 'resume', maxCount: 1 }, { name: 'photo', maxCount: 1 }]), careerController.applyCareer); // POST /api/career/apply



router.get('/admin/all', careerController.getAllOpportunities);         
router.get('/applications', careerController.getApplications);
router.put('/applications/:id', careerController.updateApplication);
router.delete('/applications/:id', careerController.deleteApplication);

router.get('/:id', careerController.getOpportunityById);               
router.post('/', careerController.createOpportunity);          
router.put('/:id', careerController.updateOpportunity);        
router.patch('/:id/toggle', careerController.toggleActive);            
router.delete('/:id', careerController.deleteOpportunity);             

module.exports = router;
