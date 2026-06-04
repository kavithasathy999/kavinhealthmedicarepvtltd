const express = require('express');
const router = express.Router();
const { sendContactEmail, getContacts, updateContact, deleteContact } = require('../controllers/contactController');

router.post('/', sendContactEmail);
router.get('/', getContacts);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;