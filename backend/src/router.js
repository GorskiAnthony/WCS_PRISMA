const express = require("express");

const router = express.Router();

const campusControllers = require("./controllers/campusControllers");

router.get("/campuses", campusControllers.get);
router.get("/campuses/:id", campusControllers.getOne);
router.put("/campuses/:id/language", campusControllers.addLanguage);
router.post("/campuses", campusControllers.add);

const languageControllers = require("./controllers/languageControllers");

router.get("/languages", languageControllers.get);
router.get("/languages/:id", languageControllers.getOne);
router.post("/languages", languageControllers.add);

const userControllers = require("./controllers/userControllers");

router.get("/users", userControllers.get);
router.get("/users/:id", userControllers.getOne);
router.post("/users", userControllers.add);

module.exports = router;
