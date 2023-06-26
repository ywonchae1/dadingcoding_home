/*
const makeCalendar = (date) => {
    const currentYear = new Date(date).getFullYear();
    const currentMonth = new Date(date).getMonth() + 1;

    const firstDay = new Date(date.setDate(1)).getDay();
    const lastDay = new Date(currentYear, currentMonth, 0).getDate();
  
    const limitDay = firstDay + lastDay;
    const nextDay = Math.ceil(limitDay / 7) * 7;
  
    let htmlDummy = '';
  
    for (let i = 0; i < firstDay; i++) {
      htmlDummy += `<div class="noColor"></div>`;
    }
  
    for (let i = 1; i <= lastDay; i++) {
      htmlDummy += `<div>${i}</div>`;
    }
  
    for (let i = limitDay; i < nextDay; i++) {
      htmlDummy += `<div class="noColor"></div>`;
    }
  
    document.querySelector(`.dateBoard`).innerHTML = htmlDummy;
    document.querySelector(`.dateTitle`).innerText = `${currentYear}년 ${currentMonth}월`;
}


const date = new Date();

makeCalendar(date);
*/

function calendarInit() {
    let thisMonth = new Date(); //달력에 표시되는 날짜 객체

    let currentYear = thisMonth.getFullYear(); //달력에 표시되는 년도
    let currentMonth = thisMonth.getMonth(); //달력에 표시되는 월
    let currentDate = thisMonth.getDate(); //달력에 표시되는 일

    //캘린더 렌더링
    function renderCalendar(thisMonth) {
        //이전 달의 마지막 날 날짜와 요일 구하기
        let startDay = new Date(currentYear, currentMonth, 0);
        let prevDate = startDay.getDate();
        let prevDay = startDay.getDay();

        //이번 달의 마지막 날 날짜와 요일 구하기
        let endDay = new Date(currentYear, currentMonth+1, 0);
        let nextDate = endDay.getDate();
        let nextDay = endDay.getDay();

        $('.dateTitle').text(currentYear + '.' + (currentMonth+1));
    }
}

// 이전달 이동
document.querySelector(`.prevDay`).onclick = () => {
    makeCalendar(new Date(date.setMonth(date.getMonth() - 1)));
}

// 다음달 이동
document.querySelector(`.nextDay`).onclick = () => {
    makeCalendar(new Date(date.setMonth(date.getMonth() + 1)));
}