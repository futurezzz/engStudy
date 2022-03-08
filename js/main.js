const mainChapter = document.querySelector('.main-unit-list');
const subUnitList = document.querySelector('.sub-unit-list');
const calendarToday = document.querySelector('.calendar-today');
const calendarUnitList = document.querySelector('.calender-unit-list');
const userBox = document.querySelector('.user');
const signIn = document.querySelector('.signIn');
const changeUser = document.querySelector('.change-user');
const mainUnit = document.querySelector('.main-unit');
let elem;
let unitNo;
let today = new Date();
let thisMonth = `${today.getFullYear()}/${today.getMonth()+1}`;
let user;
let chapter;
let week = ['일','월','화','수','목','금','토'];
let todayDay = week[today.getDay()];
let lastDay;
let lastDayOfMonth;
let dayOfFirst;
let units = [];
let itemArray = [];
let dateScoreArray = [];
let scoreArray = [];
let unitLength = 0; //전체 unit의 개수
const score = document.querySelector('.score');

getDayOfFirst();

// sign in - skyshim or lamon
userBox.addEventListener('click', (e)=>{
  user = e.target.dataset.user;
  if(user){
    userBox.style.display = 'none';
    signIn.style.display = 'block';
    changeUser.style.display = 'block';
    mainUnit.style.display = 'block';
    signIn.textContent = user;
    console.log(user);
  }
});


  changeUser.addEventListener('click',()=>{
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
})

// import {SelectData} from './firebase.js';

mainChapter.addEventListener('click', (e)=> {
  chapter = e.target.dataset.chapter;
  if ( chapter ) {
    init();
    console.log(chapter);
    // SelectData();
    // displayUnits();
  }
})

function transferData(){
  let isAvailable = elem.classList.contains("unit"); //빈공간이 아닌 버튼을 눌렀으면 true
  if(isAvailable){
    elem.classList.add('unit-on');
    unitNo = elem.dataset.unit;
    localStorage.setItem("user",user);
    localStorage.setItem("unit",unitNo);
    localStorage.setItem("chapter",chapter);
    localStorage.setItem("scoreArray",JSON.stringify(scoreArray));
    localStorage.setItem("dateScoreArray",JSON.stringify(dateScoreArray));
    if (typeof (window.open) == "function")
    { window.open("quiz.html"); 
    } else { window.location.href = "quiz.html";
    }
  }
}


//main
function init(){
  loadItems()
  .then(items => {
    displayItems(items);
    // displayUnits();
  })
  .catch(console.log);
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
  // 요일 표시
  calendarUnitList.innerHTML = ''; //unit메뉴들을 초기화
  for(let j=0; j<7; j++){
    const li = document.createElement('li');
    let realDay = (dayOfFirst + j)>6 ? (dayOfFirst + j)-7 : (dayOfFirst + j);
    li.innerHTML = `${week[realDay]}`;
    li.classList.add('calender-day-title');
    if (realDay == 0){
      li.style.backgroundColor = 'rgb(220,70,70)';
    }
    calendarUnitList.append(li);
  }
  for(let i=0; i<lastDayOfMonth; i++ ){
    const li = document.createElement('li');
    let dateScoreItem = dateScoreArray[i];
    li.innerHTML = `Day ${i+1} <br/> ${dateScoreItem}`;
    li.classList.add('calender-unit');
    if (dateScoreItem >= 15000 ){
      li.style.backgroundColor = "rgba(20, 54, 68,"+dateScoreItem/20000 +")"
      li.style.color = "rgb(250,250,250)";
    }
    else if (dateScoreItem > 0){
      li.style.backgroundColor = "rgba(20, 54, 68,"+dateScoreItem/25000 +")"
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
  const grouped = groupBy(units);
  // console.log(grouped);
}

function displayUnits(){
  calendarToday.textContent = '';
  calendarUnitList.innerHTML = '';
  subUnitList.innerHTML = ''; //unit메뉴들을 초기화
  for(let i=0; i<unitLength; i++ ){
    const li = document.createElement('li');
    let scoreItem = scoreArray[i];
    let scoreColor = scoreItem/20000*250;
    li.innerHTML = `Unit ${i+1} <br/> ${scoreItem}`;
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
    subUnitList.append(li);
  }
}
