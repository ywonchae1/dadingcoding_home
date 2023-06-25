const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/studentController");

router.use((req, res) => {
    console.log("Router for student page was started");
    next();
});

router.get('/:sid', (req, res) => {
    teacherController.studentPage;
});

module.exports = router;