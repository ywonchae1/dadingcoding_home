//db정보받기
const db = require("../config/db.js");

module.exports = {
    getInfoById: async(id) => {
        try {
            let rawQuery = `
            SELECT *
            FROM accounts
            WHERE id = ?;`;
            let res = db.query(rawQuery, [id]);
            return res[0];
        } catch(err) {
            return err;
        }
    }
}