const express = require("express");

const router = express.Router();

const campusControllers = require("./controllers/campusControllers");

router.get("/campuses", campusControllers.get);
router.get("/campuses/:id", campusControllers.getOne);
router.post("/campuses", campusControllers.add);

module.exports = router;
