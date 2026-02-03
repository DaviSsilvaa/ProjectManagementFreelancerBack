const router = require("express").Router();
const ProjectController = require("../controllers/projectController");

// GET /projects
router.get("/", ProjectController.list);

// GET /projects/:id
router.get("/:id", ProjectController.getById);

// POST /projects
router.post("/", ProjectController.create);

// PUT /projects/:id
router.put("/:id", ProjectController.update);

// DELETE /projects/:id
router.delete("/:id", ProjectController.remove);

module.exports = router;
