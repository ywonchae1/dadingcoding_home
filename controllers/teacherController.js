const teacherModel = require("../models/teacherModel.js");

module.exports = {
    teacherPage: async(req, res) => {
        let teacherInfo = await teacherModel.getInfoById(req.params.tid);
        res.render('user/userLayout.ejs', {info: teacherInfo});
    }
};