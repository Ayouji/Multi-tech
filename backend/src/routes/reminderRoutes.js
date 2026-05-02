const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');

router.get('/', reminderController.getAll);
router.post('/', reminderController.create);
router.delete('/:id', reminderController.delete);

module.exports = router;
