const router = require("express").Router();
const ProjectController = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware"); 


router.get("/", authMiddleware, ProjectController.list);
router.get("/:id", authMiddleware, ProjectController.getById);
router.post("/", authMiddleware, ProjectController.create);

router.put("/:id", authMiddleware, ProjectController.update);
router.patch("/:id", authMiddleware, ProjectController.update); 

router.delete("/:id", authMiddleware, ProjectController.remove);
router.post('/:id/analyze', authMiddleware, ProjectController.getAiAnalysis);

module.exports = router;