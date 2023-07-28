//db정보받기
const db = require("../config/db.js");

module.exports = {
    getTeacherSchedule: async() => {
        try {
            getTeachersRawQuery = `
            SELECT t_id
            FROM teachers;`
            rawQuery = `
            SELECT *
            FROM able_ttimes
            ORDER BY tt_tid;`;
            
            let teachers = await db.query(getTeachersRawQuery);
            let res = await db.query(rawQuery);

            return {'schedules': res[0], 'teachers': teachers[0]};
        } catch(err) {
            return err;
        }
    },
    
    getStudentSchedule: async() => {
        try {
            getStudentsRawQuery = `
            SELECT s_id
            FROM students;`
            rawQuery = `
            SELECT *
            FROM able_stimes
            ORDER BY st_sid;`;

            let students = await db.query(getStudentsRawQuery);
            let res = await db.query(rawQuery);

            return {'schedules': res[0], 'students': students[0]};
        } catch(err) {
            return err;
        }
    }
}