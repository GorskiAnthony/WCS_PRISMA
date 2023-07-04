const express = require("express");

const router = express.Router();

const campusControllers = require("./controllers/campusControllers");

router.get("/campuses", campusControllers.get);
router.get("/campuses/:id", campusControllers.getOne);
router.post("/campuses", campusControllers.add);

const languageControllers = require("./controllers/languageControllers");

router.get("/languages", languageControllers.get);
router.get("/languages/:id", languageControllers.getOne);
router.post("/languages", languageControllers.add);

module.exports = router;
