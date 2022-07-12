const mainChapter = document.querySelector('.main-unit-list');
const grammerChapter = document.querySelector('.grammer-unit-list');
const subUnitList = document.querySelector('.sub-unit-list');
const grammerSubUnitList = document.querySelector('.grammer-sub-unit-list');
// const subSpeakList = document.querySelector('.sub-speak-list');
const calendar = document.querySelector('.calendar');
const calendarToday = document.querySelector('.calendar-today');
const calendarLeftArrow =  document.querySelector('.calendar-left-arrow');
const calendarRighttArrow =  document.querySelector('.calendar-right-arrow');
const calendarUnitList = document.querySelector('.calender-unit-list');
const userBox = document.querySelector('.user');
const signIn = document.querySelector('.signIn');
const signInImg = document.querySelector('.signIn-img');
const changeUser = document.querySelector('.change-user');
const mainUnit = document.querySelector('.main-unit');
let shiftMonth = 0;
let quizType;
let url;
let elem;
let unitNo;
let today = new Date();
let thisMonth = `${today.getFullYear()}/${today.getMonth()+1}`;
let user;
let chapter;
// let chapterForJSON;
let chapterTitle;
let week = ['일','월','화','수','목','금','토'];
let todayDay = week[today.getDay()];
let lastDay;
let lastDayOfMonth;
let dayOfFirst;
let units = [];
let itemArray = [];
let dateScoreArray = [];
let scoreArray = [];
let scoreValue;
// let scoreSpeakArray = [];
let unitLength = 0; //전체 unit의 개수
const score = document.querySelector('.score');

getDayOfFirst();

// sign in - skyshim or lamon
userBox.addEventListener('click', (e)=>{
  user = e.target.dataset.user;
  if(user){
    userBox.style.display = 'none';
    signIn.style.display = 'block';
    signInImg.classList.add(`thumb${user}`);
    signInImg.style.display = 'block';
    changeUser.style.display = 'block';
    mainUnit.style.display = 'block';
    calendar.style.visibility = 'visible';
    signIn.textContent = user;
    console.log(user);
  }
});

changeUser.addEventListener('click',()=>{
    signInImg.classList.remove(`thumb${user}`);
    if (user == 'SkyShim'){
      user = 'Lamon'
    }
    else if (user == 'Lamon'){
      user = 'Mirae'
    }
    else {
      user = 'SkyShim'
    }
    signIn.textContent = user;
    signInImg.classList.add(`thumb${user}`);
})

// import {SelectData} from './firebase.js';

// firebase.jsdpeh mainChapter.addEventListner 에도 보강이 있음. 동시에 진행됨
mainChapter.addEventListener('click', (e)=> {
  chapter = e.target.dataset.chapter;
  calendar.style.visibility = 'hidden';
  // unitLength =  parseInt(e.target.dataset.unitNo);
  if ( chapter ) {
    init();
    console.log(chapter);
    // SelectData();
    // displayUnits();
  }
})

// firebase.jsdpeh grammerChapter.addEventListner 에도 보강이 있음. 동시에 진행됨
grammerChapter.addEventListener('click', (e)=> {
  chapter = e.target.dataset.chapter;
  calendar.style.visibility = 'hidden';
  // unitLength =  parseInt(e.target.dataset.unitNo);
  if ( chapter ) {
    init();
    // console.log(chapter);
    // SelectData();
    // displayUnits();
  }
})


//main
function init(){
  loadItems()
  .then(items => {
    displayItems(items);
    // displayUnits();
  })
  .catch(console.log);
}


function transferData(){
  let isAvailable = elem.classList.contains("unit"); //빈공간이 아닌 버튼을 눌렀으면 true
  if(isAvailable){
    elem.classList.add('unit-on');
    unitNo = elem.dataset.unit;
    localStorage.setItem("user",user);
    localStorage.setItem("unit",unitNo);
    localStorage.setItem("unitLength",unitLength);
    localStorage.setItem("chapter",chapter);
    // localStorage.setItem("chapterForJSON",chapterForJSON);
    localStorage.setItem("chapterTitle",chapterTitle);
    localStorage.setItem("quizType",quizType);
    localStorage.setItem("scoreArray",JSON.stringify(scoreArray));
    // localStorage.setItem("scoreSpeakArray",JSON.stringify(scoreSpeakArray));
    localStorage.setItem("dateScoreArray",JSON.stringify(dateScoreArray));
    localStorage.setItem("scoreValue",scoreValue);
    let url = (chapter !=='GRIU' ? "quiz.html" : "quizGrammer.html");
    if (typeof (window.open) == "function")
    { window.open(url); 
    } else { window.location.href = url;
    // { window.open("quiz.html"); 
    // } else { window.location.href = "quiz.html";
    }
  }
}



// functions
async function loadItems(){
  const response = await fetch(`data/${chapter}.json`);
  const json = await response.json();
  itemArray = json.items;
    // .filter(item => item.chapter == 'NativeA');
  return itemArray;
}

function getDayOfFirst(){
  lastDay = new Date(today.getFullYear(),today.getMonth()+1,0);
  lastDayOfMonth = lastDay.getDate();
  dayOfFirst = (new Date(today.getFullYear(),today.getMonth(),1)).getDay();
}


function displayCalendar(){
  //이전에 표시된 단원선택표가 있으면 우선 초기화(지우기)
  calendarToday.textContent =  `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()} ${week[today.getDay()]}`;
  subUnitList.innerHTML = ''; 
  grammerSubUnitList.innerHTML = ''; 
  // subSpeakList.innerHTML = ''; 
  // 요일 표시
  calendarUnitList.innerHTML = ''; //unit메뉴들을 초기화
  for(let j=0; j<7; j++){
    const li = document.createElement('li');
    let realDay = (dayOfFirst + j)>6 ? (dayOfFirst + j)-7 : (dayOfFirst + j);
    li.innerHTML = `${week[realDay]}`;
    li.classList.add('calender-day-title');
    if (realDay == 0){ //일요일이면 제목을 빨간색으로 표시
      li.style.backgroundColor = 'rgb(220,70,70)';
    }
    calendarUnitList.append(li);
  }
  for(let i=0; i<lastDayOfMonth; i++ ){
    const li = document.createElement('li');
    let dateScoreItem = dateScoreArray[i];
    li.innerHTML = `Day ${i+1} <br/> ${dateScoreItem}`;
    li.classList.add('calender-unit');
    if (dateScoreItem >= 100000 ){
      li.style.background = "linear-gradient(#fd1d1d, #15326e)"
      li.style.color = "rgb(250,250,250)";
    }
    else if (dateScoreItem >= 70000 ){
      li.style.backgroundColor = "rgb(185, 50, 50)"
      li.style.color = "rgb(250,250,250)";
    }
    else if (dateScoreItem >= 50000 ){
      li.style.backgroundColor = "rgb(65, 30, 100)"
      li.style.color = "rgb(250,250,250)";
    }
    else if (dateScoreItem >= 40000 ){
      li.style.backgroundColor = "rgb(30, 54, 88)"
      li.style.color = "rgb(250,250,250)";
    }
    else if (dateScoreItem >= 15000 ){
      li.style.backgroundColor = "rgba(50, 100, 30,"+dateScoreItem/20000 +")"
      li.style.color = "rgb(250,250,250)";
    }
    else if (dateScoreItem > 0){
      li.style.backgroundColor = "rgba(50, 100, 30,"+dateScoreItem/25000 +")"
      li.classList.add('unit-box-border');
    }
    // li.style.backgroundColor = (scoreItem == 0) ? "rgba(0,0,0,.5)" : ("rgba(220,10,10,"+scoreItem/10000 +")")
    // li.dataset.unit = i+1; //나중에 li선택시 어떤 unit을 클릭했는지 데이터 전송을 위해 필요
    calendarUnitList.append(li);
  }
}


//groupBy 함수를 만들어 unit별로 group후 unit개수 알아내기
// function groupBy(list, keyGetter) {
//   const map = new Map();
//   list.forEach((item) => {
//     const key = keyGetter(item);
//     const collection = map.get(key);
//     if (!collection) {
//         map.set(key, [item]);
//     } else {
//         collection.push(item);
//     }
//   });
//   return map;
// }
function groupBy(list) {
  let collectionArray = [];
  unitLength = 0;
  list.forEach((item) => {
    const collection = item.unit;
    if (!collectionArray.includes(collection)){
        unitLength++;
        collectionArray.push(collection);
    } 
  });
  return unitLength;
}


function displayItems(items){
  units = items.map(item=>item);
  groupBy(units);
  // console.log(unitLength);
}

function displayUnits(){
  calendarToday.textContent = '';
  calendarUnitList.innerHTML = '';
  subUnitList.innerHTML = ''; //unit메뉴들을 초기화
  grammerSubUnitList.innerHTML = ''; //unit메뉴들을 초기화
  // subSpeakList.innerHTML = ''; //unit메뉴들을 초기화
  // 첫번째 unit들 표시(짝 맞추기)
  for(let i=0; i<unitLength; i++ ){
    const li = document.createElement('li');
    const li2 = document.createElement('li');
    let scoreItem = scoreArray[i];
    //GRIU 인 경우에는 따로 Unit이름을 정해주었음
    // li.innerHTML = ((chapter!=='GRIU') ? `${chapter} ${i+1} <br/> ${scoreItem}` : `${units[i].unit} <br/> ${scoreItem}`);
    li.innerHTML = `${chapter} ${i+1} <br/> ${scoreItem}`;
    li.classList.add('unit');
    if (scoreItem >= 7000 ){
      li.style.backgroundColor = "rgba(220,10,10,"+scoreItem/15000 +")"
      li.style.color = "rgb(250,250,250)";
    }
    else if (scoreItem > 0){
      li.style.backgroundColor = "rgba(220,10,10,"+scoreItem/15000 +")"
      li.classList.add('unit-box-border');
    }
    // li.style.backgroundColor = (scoreItem == 0) ? "rgba(0,0,0,.5)" : ("rgba(220,10,10,"+scoreItem/10000 +")")
    li.dataset.unit = i+1; //나중에 li선택시 어떤 unit을 클릭했는지 데이터 전송을 위해 필요
    if(chapter!=='GRIU'){
      subUnitList.append(li);}
    else {
      grammerSubUnitList.append(li);
    }
  }

  // 두번째 unit표시 (speak관련)
  
  //scoreSpeakArray 가 아직 없는 상태라면 새로 만들어라
//--------------- 점수에 따라 Speak로 바로 진행하도록 바꾸었음. 아래 코딩 필요없음

  // scoreSpeakArray = scoreSpeakArray ?? new Array(unitLength).fill(0); 
  // for(let i=0; i<unitLength; i++ ){
  //   const li = document.createElement('li');
  //   // scoreSpeakArray의 값이 있으면 그 값을 사용. 없으면 0을 넣는다
  //   let scoreSpeakItem = scoreSpeakArray[i];
  //   li.innerHTML = `${chapter} ${i+1} <br/> ${scoreSpeakItem}`;
  //   li.classList.add('unit');
  //   if (scoreSpeakItem >= 7000 ){
  //     li.style.backgroundColor = "rgba(0,80,120,"+scoreSpeakItem/15000 +")"
  //     li.style.color = "rgb(250,250,250)";
  //   }
  //   else if (scoreSpeakItem > 0){
  //     li.style.backgroundColor = "rgba(0,80,120,"+scoreSpeakItem/15000 +")"
  //     li.classList.add('unit-speak-border');
  //   }
  //   // li.style.backgroundColor = (scoreItem == 0) ? "rgba(0,0,0,.5)" : ("rgba(220,10,10,"+scoreItem/10000 +")")
  //   li.dataset.unit = i+1; //나중에 li선택시 어떤 unit을 클릭했는지 데이터 전송을 위해 필요
  //   subSpeakList.append(li);
  // }


}
