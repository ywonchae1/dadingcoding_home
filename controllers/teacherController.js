const path = require('path');
const teacherModel = require("../models/teacherModel.js");

module.exports = {
    teacherPage: async(req, res) => {
        let teacherInfo = teacherModel.getInfoById(req.params.id);
        res.json(teacherInfo);
    }
};