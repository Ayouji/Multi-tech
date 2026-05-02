const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');

router.get('/', trackingController.getAll);
router.post('/', trackingController.create);
router.delete('/:id', trackingController.delete);

module.exports = router;
