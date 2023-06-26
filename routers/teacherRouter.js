const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");

router.use((req, res, next) => {
    console.log("Router for teacher page was started");
    next();
});

router.get(
    '/settings',
    teacherController.teacherPage
);

router.get(
    '/schedules',
    teacherController.teacherSchedule
);

router.get(
    '/attend',
    //teacherController.teacherPage
);

module.exports = router;