const express = require('express');
const router = express.Router();
const metaTagsController = require('../controllers/metaTagsController');

router.get('/', metaTagsController.getAllMetaTags);
router.get('/current', metaTagsController.getMetaTagByRoute);
router.post('/', metaTagsController.createMetaTag);
router.put('/:id', metaTagsController.updateMetaTag);
router.delete('/:id', metaTagsController.deleteMetaTag);

module.exports = router;
