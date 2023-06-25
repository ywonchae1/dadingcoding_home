const studentModel = require("../models/studentModel.js");

module.exports = {
    studentPage: async(req, res) => {
        console.log(req);
        let teacherInfo = studentModel.getInfoById(req.params.id);
        res.send(teacherInfo);
    }
};