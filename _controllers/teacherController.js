const path = require('path');
const teacherModel = require("../_models/teacherModel.js");

module.exports = {
    teacherPage: async(req, res) => {
        res.json(req.params);
    }
};