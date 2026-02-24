const { Router } = require('express');
const multer = require('multer');
const multerConfig = require('../config/multer');
const attachmentController = require('../controllers/attachmentController'); // Verifique se o nome do arquivo está idêntico (letras maiúsculas/minúsculas)

const router = Router();
const upload = multer(multerConfig);


router.post('/:project_id', upload.single('file'), attachmentController.store);
router.get('/audit/:project_id', attachmentController.getAuditLogs);
router.delete('/:id', attachmentController.deleteAttachment);

module.exports = router;