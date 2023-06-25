const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");

router.use((req, res, next) => {
    console.log("Router for teacher page was started");
    next();
});

router.get(
    '/:tid',
    teacherController.teacherPage
);

module.exports = router;