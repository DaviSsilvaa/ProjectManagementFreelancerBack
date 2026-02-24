const router = require("express").Router();
const ProjectController = require("../controllers/projectController");

// Rotas para /api/v1/projects

router.get("/", ProjectController.list);
router.get("/:id", ProjectController.getById);
router.post("/", ProjectController.create);

// 1. Mantenha o PUT para atualizações completas
router.put("/:id", ProjectController.update);

// 2. ADICIONE O PATCH para mudanças parciais como o STATUS
// Isso evita o erro 404 se o axios enviar como .patch()
router.patch("/:id", ProjectController.update); 

router.delete("/:id", ProjectController.remove);
router.post('/:id/analyze', ProjectController.getAiAnalysis);

module.exports = router;