const express = require("express");
const router = express.Router();
const teacherController = require("../_controllers/teacherController");

router.use((req, res) => {
    console.log("Router for teacher page was started");
    next();
});

router.get('/:tid', (req, res) => {
    teacherController.mainPage;
});