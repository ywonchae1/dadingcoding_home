const adminModel = require("../models/adminModel.js");

function calcTime(start, end) {
    let startMin = hourToMin(start);
    let endMin = hourToMin(end);
    
    if(endMin - startMin >= 120) return true;
    else return false;
}

//시간을 분으로 변환하는 함수
function hourToMin(timeString) {
    let result = Number(timeString.slice(0, 2)) * 60;
    result += Number(timeString.slice(3, 5));
    return result;
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
            //ValueList의 요소는 리스트임(회원 별)
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
            let okList = []; //매칭 정보
            let readyQ = []; //매칭 대기열
            teachers.forEach(el => readyQ.push(el.t_id));
            students.forEach(el => readyQ.push(el.s_id));
            
            //매칭 시작, 선생님 리스트 끝까지 갈 때까지 무한 반복
            let tIdx = 0; //선생님 리스트 인덱싱
            let taIdx = 0; //선생님A의 되는 시간 리스트 인덱싱
            let sIdx = 0; //수강생 리스트 인덱싱
            let saIdx = 0; //수강생B의 되는 시간 리스트 인덱싱
            while(true) {
                for(tIdx = 0; tIdx < tValueList.length; tIdx++) {
                    //선생님 한 명의 되는 시간 리스트를 가져옴
                    let aTeacherScheduls = tValueList[tIdx];
                    let tId = aTeacherScheduls[0].tt_tid; //이 리스트의 선생님 이름
                    let isMatchedStudent = false; //수강생 끝까지 매칭이 되었는지 확인하는 변수
                    if(readyQ.indexOf(tId) !== -1) {
                        //선생님이 매칭되지 않았을 때만 매칭 시작
                        for(taIdx = 0; taIdx < aTeacherScheduls.length; taIdx++) {
                            //선생님 한 명의 되는 시간 한 개를 가져옴
                            let aTSchedule = aTeacherScheduls[taIdx];
                            //수강생 중 맞는 사람이 있는지 확인
                            for(sIdx = 0; sIdx < sValueList.length; sIdx++) {
                                let aStudentSchedules = sValueList[sIdx];
                                let sId = aStudentSchedules[0].st_sid;
                                if(readyQ.indexOf(sId) !== -1) {
                                    for(saIdx = 0; saIdx < aStudentSchedules.length; saIdx++) {
                                        let aSSchedule = aStudentSchedules[saIdx];
                                        //aTSchedule과 aSSchedule이 맞는 일정인지 확인
                                        if(hourToMin(aTSchedule.tt_start) > hourToMin(aSSchedule.st_end)
                                        || hourToMin(aTSchedule.tt_end) < hourToMin(aSSchedule.st_start)){
                                            console.log(aTSchedule.tt_start);
                                        }
                                        else {
                                            let resultStartTime = '';
                                            let resultEndTime = '';
                                            //기준이 될 수 있는 시작 시간과 종료 시간을 구함
                                            //1. 선생님 시작 시간보다 수강생 시작 시간이 늦을 때
                                            if(hourToMin(aTSchedule.tt_start) < hourToMin(aSSchedule.st_start)) {
                                                //무조건 학생 시작시간 기준
                                                resultStartTime = aSSchedule.st_start;
                                                
                                                //종료시간을 알아보아야 함
                                                //2. 선생님 끝나는 시간이 수강생 끝나는 시간보다 늦을 때
                                                //=> 선생님 가능 시간이 수강생 가능 시간을 감쌀 때
                                                if(hourToMin(aTSchedule.tt_end) > hourToMin(aSSchedule.st_end)) {
                                                    resultEndTime = aSSchedule.st_end;
                                                } else {
                                                    //3. 수강생 끝나는 시간이 선생님 끝나는 시간보다 늦을 때
                                                    resultEndTime = aTSchedule.tt_end;
                                                }
                                            } else {
                                                //3. 수강생 시작시간보다 선생님 시작시간이 늦을 때
                                                //무조건 선생님 시작시간 기준
                                                resultStartTime = aTSchedule.tt_start;
                                                
                                                //종료시간을 알아보아야 함
                                                //4. 선생님 끝나는 시간이 수강생 끝나는 시간보다 늦을 때
                                                if(hourToMin(aTSchedule.tt_end) > hourToMin(aSSchedule.st_end)) {
                                                    resultEndTime = aSSchedule.st_end;
                                                } else {
                                                    //5. 수강생 끝나는 시간이 선생님 끝나는 시간보다 늦을 때
                                                    //=> 수강생 가능 시간이 선생님 가능 시간을 감쌀 때
                                                    resultEndTime = aTSchedule.tt_end;
                                                }

                                            }
                                            //매칭이 가능한 경우, 120시간 이상인지 확인
                                            if(hourToMin(resultEndTime) - hourToMin(resultStartTime) >= 120) {
                                                //120시간 이상인 경우, readyQ에서 선생님과 수강생을 제거, okList에 매칭 정보 저장
                                                readyQ.splice(readyQ.indexOf(tId),1);
                                                readyQ.splice(readyQ.indexOf(sId),1);
                                                okList.push([tId, sId, resultStartTime, resultEndTime]);
                                                console.log(readyQ);
                                                console.log(okList);
                                                isMatchedStudent = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                                //이 수강생에 대한 매칭이 되었다면 다음 선생님으로 넘어감
                                if(isMatchedStudent) break;
                            }
                            //이 수강생에 대한 매칭이 되었다면 다음 선생님으로 넘어감
                            if(isMatchedStudent) break;
                        }
                    }
                }
                //readyQ가 모두 비어 모든 사람들이 매칭된 경우 while true를 종료
                if(readyQ.length === 0) break;
            }

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