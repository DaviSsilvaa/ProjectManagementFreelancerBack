const { Router } = require('express');
const clientController = require('../controllers/clientController');
const auth = require('../middleware/authMiddleware');

const router = Router();

router.use(auth);

router.post('/', clientController.create);
router.get('/', clientController.listAll);
router.get('/:id', clientController.getById);
router.delete('/:id', clientController.remove);
router.put('/:id', clientController.update);


module.exports = router;
