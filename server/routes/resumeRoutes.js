'use strict';
const router = require('express').Router();
const multer = require('multer');
const env = require('../config/env');
const ctrl = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(), // nothing is written to disk
  limits: { fileSize: env.maxFileMb * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => (/\.(pdf|docx)$/i.test(file.originalname) ? cb(null, true) : cb(Object.assign(new Error('Only PDF and DOCX files are supported.'), { status: 415 }))),
});

router.use(protect);
router.post('/upload', upload.single('file'), ctrl.upload);
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
