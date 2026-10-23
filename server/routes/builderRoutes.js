'use strict';
const router = require('express').Router();
const ctrl = require('../controllers/builderController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
