const router = require("express").Router();
const ProjectController = require("../controllers/projectController");

// /api/v1/projects
router.get("/", ProjectController.list);
router.get("/:id", ProjectController.getById);
router.post("/", ProjectController.create);
router.put("/:id", ProjectController.update);
router.delete("/:id", ProjectController.remove);

module.exports = router;
