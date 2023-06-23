const teacherModel = require("../_models/teacherModel.js");

module.exports = {
    mainPage: async(req, res, next) => {
        res.render(`teacher ${req.tid} page`);
    }
}