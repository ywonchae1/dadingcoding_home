const studentModel = require("../_models/studentModel.js");

module.exports = {
    studentPage: async(req, res) => {
        console.log(req);
        res.send(req.params);
    }
};