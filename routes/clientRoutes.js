const { Router } = require('express');
const clientController = require('../controllers/clientController');
const auth = require('../middleware/authMiddleware'); // confirme o nome da pasta

const router = Router();

router.use(auth); // tudo abaixo exige token

router.post('/', clientController.create);
router.get('/', clientController.listAll);
router.get('/:id', clientController.getById);
router.delete('/:id', clientController.remove); // <-- necessário para excluir

module.exports = router;
