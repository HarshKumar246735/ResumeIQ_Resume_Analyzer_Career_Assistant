'use strict';
const router = require('express').Router();
const { overview } = require('../controllers/analysisController');
const { protect } = require('../middleware/auth');

router.get('/overview', protect, overview);
module.exports = router;
