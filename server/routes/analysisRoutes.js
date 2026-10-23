'use strict';
const router = require('express').Router();
const ctrl = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.delete('/:id', ctrl.remove);

module.exports = router;
