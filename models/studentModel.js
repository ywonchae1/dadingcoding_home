//db정보받기
const db = require("../config/db.js");

module.exports = {
    //id로 계정 정보 가져오기
    getInfoById: async(id) => {
        try {
            let rawQuery = `
            SELECT *, DATE_FORMAT(s_birth, '%Y-%m-%d') AS birth_format
            FROM students
            JOIN accounts
            ON s_id=id
            WHERE id=?;`;
            let res = await db.query(rawQuery, [id]);
            return res[0][0]; //정보의 묶음이 하나임
        } catch(err) {
            return err;
        }
    },
    
    getScheduleById: async(id) => {
        try {
            let rawQuery = `
            SELECT c_id, c_tid, c_sid, c_datetime,
            CASE WEEKDAY(c_datetime) 
            WHEN '0' THEN '월요일'
            WHEN '1' THEN '화요일'
            WHEN '2' THEN '수요일'
            WHEN '3' THEN '목요일'
            WHEN '4' THEN '금요일'
            WHEN '5' THEN '토요일'
            WHEN '6' THEN '일요일'
            END as weekday,
            DATE_FORMAT(c_datetime, '%H : %i') AS time,
            MONTH(c_datetime) AS month,
            DAY(c_datetime) AS day
            FROM classes
            WHERE c_sid=?`
            let res = await db.query(rawQuery, [id]);
            return res[0];
        } catch(err) {
            return err;
        }
    },

    getApptById: async(id) => {
        try {
            let rawQuery = `
            SELECT st_id, st_sid, st_day, st_start, st_end,
            TIME_FORMAT(st_start, '%H:%i') AS form_st_start, TIME_FORMAT(st_end, '%H:%i') AS form_st_end
            FROM able_stimes
            WHERE st_sid=?`
            let res = await db.query(rawQuery, [id]);
            return res[0];
        } catch(err) {
            return err;
        }
    },

    insertAppt: async(id, data) => {
        try {
            let insertRawQuery = `
            INSERT INTO able_stimes (st_sid, st_day, st_start, st_end)
            VALUES (?, ?, ?, ?);`;

            let updateRawQuery = `
            UPDATE able_stimes
            SET st_start=?, st_end=?
            WHERE st_sid=? AND st_day=?;`;

            let checkExistRawQuery = `
            SELECT *
            FROM able_stimes
            WHERE st_sid=? AND st_day=?;`;

            dataLength = data['new'].length;
            if(dataLength === 0) {
                return;
            } else if(dataLength === 1) {
                let exist = await db.query(checkExistRawQuery, [id, data['day']]);
                exist = exist[0][0];
                if(exist != null) {
                    let start = exist.tt_start;
                    let end = exist.tt_end;

                    //시간이 겹치는 게 아닐 때
                    if(exist.tt_start > data['endTime'] || exist.tt_end < data['startTime']) {
                        await db.query(insertRawQuery, [id, data['day'], data['startTime'], data['endTime']]);
                        return;
                    }
                    //시간이 겹칠 때
                    if(exist.tt_start > data['startTime']) start = data['startTime'];
                    if(exist.tt_end < data['endTime']) end = data['endTime'];

                    await db.query(updateRawQuery, [start, end, id, data['day']]);
                    return;
                }
                await db.query(insertRawQuery, [id, data['day'], data['startTime'], data['endTime']]);
            } else {
                for(let i = 0; i < dataLength; i++) {
                    let exist = await db.query(checkExistRawQuery, [id, data['day'][i]]);
                    exist = exist[0][0];
                    if(exist != null) {
                        let start = exist.tt_start;
                        let end = exist.tt_end;
    
                        //시간이 겹치는 게 아닐 때
                        if(exist.tt_start > data['endTime'][i] || exist.tt_end < data['startTime'][i]) {
                            await db.query(insertRawQuery, [id, data['day'][i], data['startTime'][i], data['endTime'][i]]);
                            return;
                        }
                        //시간이 겹칠 때
                        if(exist.tt_start > data['startTime'][i]) start = data['startTime'][i];
                        if(exist.tt_end < data['endTime'][i]) end = data['endTime'][i];
    
                        await db.query(updateRawQuery, [start, end, id, data['day'][i]]);
                        return;
                    }
                    await db.query(insertRawQuery, [id, data['day'][i], data['startTime'][i], data['endTime'][i]]);
                }
            }
        } catch(err) {
            return err;
        }
    },

    deleteAppt: async(id, data) => {
        try {
            let getApptRawQuery = `
            SELECT st_id
            FROM able_stimes
            WHERE st_sid=?;`;
            let rawQuery = `
            DELETE FROM able_stimes
            WHERE st_id=?;`;
            let res = await db.query(getApptRawQuery, [id]);
            let appt = res[0];
            let apptList = [];
            for(let j = 0; j < appt.length; j++) {
                apptList.push(appt[j]['st_id']);
            }
            console.log(apptList, data['stId']);
            for(let i = 0; i < data['stId'].length; i++) {
                if(data['stId'].indexOf(String(apptList[i])) == -1) {
                    // data 리스트에 없는 경우 : 삭제해야 함
                    await db.query(rawQuery, [apptList[i]]);
                }
            }
        } catch(err) {
            return err;
        }
    }
}