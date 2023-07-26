const adminModel = require("../models/adminModel.js");

function calcTime(start, end) {
    let startMin = 0;
    for(let i = 0; i < 5; i++) {
        if(start[i] === ':') startMin *= 60;
        else {
            startMin *= 10;
            startMin += Number(start[i]);
        }
    }
    let endMin = 0;
    for(let i = 0; i < 5; i++) {
        if(end[i] === ':') endMin *= 60;
        else {
            endMin *= 10;
            endMin += Number(end[i]);
        }
    }

    if(endMin - startMin >= 120) return true;
    else return false;
}

module.exports = {
    getAdminInfo: async(req, res) => {

    },
    
    getSchedules: async(req, res) => {
        //데이터 받아 오기
        let teacherScheduleSet = await adminModel.getTeacherSchedule();
        let studentScheduleSet = await adminModel.getStudentSchedule();

        let teachers = teacherScheduleSet['teachers'];
        let tSchedules = teacherScheduleSet['schedules'];

        let students = studentScheduleSet['students'];
        let sSchedules = studentScheduleSet['schedules'];

        //id에 따라 일정 리스트로 분류
        let tScheduleList = {};
        let sScheduleList = {};

        cutFlag = true;
        tWho = [];
        sWho = [];
        
        teachers.forEach(element => {
            tScheduleList[element.t_id] = [];
            tSchedules.forEach(tSchedule => {
                //2시간 연속이 아닌 경우를 배제하면서
                if(tSchedule.tt_tid === element.t_id && calcTime(tSchedule.tt_start, tSchedule.tt_end)) {
                    tScheduleList[element.t_id].push(tSchedule);
                }
            });
            //시간이 아예 안 되는 사람이 있는 경우
            if(tScheduleList[element.t_id].length === 0) {
                cutFlag = false;
                tWho.push(element.t_id);
            }
        });

        students.forEach(element => {
            sScheduleList[element.s_id] = [];
            sSchedules.forEach(sSchedule => {
                if(sSchedule.st_sid === element.s_id && calcTime(sSchedule.st_start, sSchedule.st_end)) {
                    sScheduleList[element.s_id].push(sSchedule);
                }
            });
            if(sScheduleList[element.s_id].length === 0) {
                cutFlag = false;
                sWho.push(element.s_id);
            }
        });

        if(cutFlag) {
            //되는 시간이 제일 적은 사람을 먼저 정렬
            tValueList = Object.values(tScheduleList);
            sValueList = Object.values(sScheduleList);

            tValueList.sort((a, b) => {
                if(a.length > b.length) return 1;
                else return -1;
            });
            sValueList.sort((a, b) => {
                if(a.length > b.length) return 1;
                else return -1;
            });

            //매칭 기본 틀 생성
            okList = [];

            res.render(
                'admin/schedules.ejs',
                {
                    teacherSchedule: tScheduleList,
                    studentSchedule: sScheduleList
                }
            );
        } else {
            //시간이 안 되는 사람이 있는 경우 에러 페이지
            res.render(
                'admin/error.ejs',
                {
                    tWho: tWho,
                    sWho: sWho
                }
            );
        }
    }
};