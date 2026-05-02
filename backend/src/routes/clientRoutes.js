const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.get('/', clientController.getAll);
router.post('/', clientController.create);
router.delete('/:id', clientController.delete);

module.exports = router;
