const title = document.querySelector('.title');
const userImg = document.querySelector('.user-img');
const unitText = document.querySelector('.unit');
const wordsList = document.querySelector('.words-list');
const score = document.querySelector('.score');
const scoreProgress = document.querySelector('.scoreProgress');
const scoreToday = document.querySelector('.score-today');
const comboBox = document.querySelector('.combo-box');
const clearBox = document.querySelector('.clearBox');
const playBtn = document.querySelector('.playBtn');
const character = document.querySelector('#character');
const audioYes = new Audio('audio/yes.mp3');
const audioNo = new Audio('audio/no.mp3');
const audioClear = new Audio('audio/clear.mp3');
let today = new Date();
let thisMonth = `${today.getFullYear()}/${today.getMonth()+1}`;
let chapter; //전역정보로 어떤 단원의 단어를 풀지 선택
const array = [];
let itemArray = []; //해당 unit에 속하는 모든 문제들 담기
const randomNum = []; //문제 10개 랜덤추출
const randomDisplay = [];  // 추출한 문제와 뜻 총 20개 객체를 랜덤으로 화면에 표시
let displayText = [];
let scoreArray = [];
let scoreSpeakArray = [];
let matchedNo;
let scoreValue;
let scoreTodayValue;
let combo = 0;
let decreaseNum = 20;//총 20요소. 영어10, 한글뜻10
let word = [];
let checkedE; //이미 선택된 영단어
let checkedK; //이미 선택된 한글뜻
let serialE; //이미 선택된 영단어
let serialK; //이미 선택된 한글뜻
var voices = [];

//main

loadLocalStorage();
loadItems()
.then(items => {
  randomArray(); //난수를 문제 10개 랜덤추출
  displayShuffle(); //난수를 발생시켜 단어와 뜻을 섞음
  displayItems(items);
  displayWords();
})
.catch(console.log);


setVoiceList();
if (window.speechSynthesis.onvoiceschanged !== undefined) {
window.speechSynthesis.onvoiceschanged = setVoiceList;
}

function loadLocalStorage(){
  if(localStorage.getItem('unit')){
    user = localStorage.getItem('user');
    userImg.classList.add(`thumb${user}`);
    unit = localStorage.getItem('unit');
    chapter = localStorage.getItem('chapter');
    scoreArray = JSON.parse(localStorage.getItem('scoreArray'));
    dateScoreArray = JSON.parse(localStorage.getItem('dateScoreArray'));
    scoreTodayValue = dateScoreArray[new Date().getDate()-1];
    scoreToday.textContent = scoreTodayValue;
    console.log(user,unit,chapter);
    title.textContent = chapter;
    unitText.textContent = `unit ${unit}`;
    scoreValue = scoreArray[unit-1];
    scoreProgressDisplay();
  }
}

// firebase2에 옮겨놓았음 -------------------------------------------------------
// wordsList.addEventListener('click',(e)=>{
//   // console.log(e.target.textContent);
//   let elem = e.target.classList;
//   // 이전에 선택된 요소를 기억했다가 다음 같은 요소(영어 또는 뜻)선택시 이전요소의 색깔 원상복귀
//   let isAvailable = elem.contains("words-list");
//   if(!isAvailable){
//     //선택된 것이 영단어이고
//     if(elem.contains('text')){
//     // 이미 선택된 영단어가 있으면 선택을 해제하고 현재 선택요소만 진하게
//       if(checkedE){
//         checkedE.replace('textOn','text')
//       }
//       elem.replace('text','textOn')
// //       speech(e.target.textContent);
// //       serialE = e.target.dataset.serial;
// //       checkedE = elem;
// //       //선택된 것이 한글뜻이고
// //     }else if(elem.contains('meaning')){
// //       // 이미 선택된 한글뜻이 있으면 선택을 해제하고 현재 선택요소만 진하게
// //       if(checkedK){
// //         checkedK.replace('meaningOn','meaning')
// //       }
// //       elem.replace('meaning','meaningOn')
// //       serialK = e.target.dataset.serial;
// //       checkedK = elem;
// //     }
// //     // 선택된 영단어와 한글뜻이 일치하면
// //     if(serialE === serialK){
// //     audioYes.play();
// //     scoreValue = scoreValue + 100 + combo*10;
// //     score.textContent = scoreValue;
// //     // 연속 정답수(combo)가 0보다 크면 화면에 combo표시
// //     if(combo>0){
// //       comboBox.innerHTML = `${combo} combo!`;
// //       comboBox.classList.add('combo-boxOn');
// //     }
// //     combo++;
// //     matchedNo++;
// //     // console.log(matchedNo);
// //     setTimeout(()=>{
// //       checkedE.add('hide');
// //       checkedK.add('hide');
// //       checkedE = '';
// //       checkedK = '';
// //     },100)
// //     setTimeout(()=>{
// //       comboBox.classList.remove('combo-boxOn');
// //     },500)
// //     // 10문제 다 맞히면 클리어. platBtn 활성화
// //     if(matchedNo === 10 ){
// //       setTimeout(()=>{
// //         audioClear.play();
// //         let m = Math.floor(Math.random()*4+1);
// //         console.log(m);
//         character.style.backgroundImage = `url('../img/character0${m}.png')`;
//         clearBox.style.display = 'block';
//         scoreProgressDisplay();
//         // console.log(scoreValue);
//         if (scoreValue > 100){
//           playBtn.classList.add('playBtnClear'); //버튼 색깔 바뀌는 css추가
//           playBtn.innerText = 'YOU DID IT!';
//         }
//         checkedE = '';
//         checkedK = '';
//         serialE = '';
//         serialK = '';
//       },300)
//     }
//     // 선택된 영단어와 한글뜻이 각각 있고 서로 다르면
//   } else if(checkedE && checkedK && serialE !== serialK){
//     audioNo.play();
//     scoreValue -= 50;
//     combo = 0;
//     score.textContent = scoreValue;
//     setTimeout(()=>{
//       checkedE.replace('textOn','text')
//       checkedK.replace('meaningOn','meaning')
//       checkedE = '';
//       checkedK = '';
//       serialE = '';
//       serialK = '';
//     },120)
//   }
// }
// });


function userImgDisplay(){
  // if (user == 'SkyShim'){
  //   userImg.style.backgroundImage = "url('../img/userskyshim.png')"
  // }
  // else if (user == 'Lamon'){
  //   userImg.style.backgroundImage = "url('../img/userlamon.png')"
  // }
  // else {
  //   userImg.style.backgroundImage = "url('../img/usermirae.png')"
  // }
  userImg.style.backgroundImage = `url('../img/user${user}.png')`;
}

function scoreProgressDisplay(){
  let scoreProgressValue = scoreValue / 100;
  console.log(scoreValue)
  if (scoreProgressValue >= 190) {
    scoreProgressValue = 200;
    scoreProgress.style.borderRadius = '10px'
  }
  scoreProgress.style.width = `${scoreProgressValue}px`
}
// import {InsertData} from ('./firebase.js');
// 10문제 맞힌 후 play 버튼 활성화.
// 이 play버튼을 누르면 다시 게임 시작
// firebase.js 에서 대신 실행함
// playBtn.addEventListener('click',()=>{
//   clearBox.style.display = 'none';
//   randomArray(); //난수를 발생시켜 단어와 뜻을 섞음
//   displayWords();

// })


// function loadItems(){
//   return fetch('data/data.json')
//   .then(response => response.json())
//   .then(function(json) {
//     itemArray = json.items
//       .filter(item => item.chapter == chapter && item.unit == unit) 
//     return itemArray; //filter된 itemArray를 반환해야 함! 
//   })
// };
//위의 함수를 아래처럼 async로 바꾸어 준 형태
async function loadItems(){
  const response = await fetch(`data/${chapter}.json`);
  const json = await response.json();
  itemArray = json.items
    .filter(item => item.unit == unit);
  return itemArray;
};


function displayItems(items){
  // title.textContent = ('ENG100A');
  word = items.map(item=>item);
}

function displayWords(){
  score.textContent = scoreValue;
  matchedNo = 0;
  combo = 0;
  wordsList.innerHTML = ''; //자리 차지하고 있던 li들 모두 제거
  for(let i=0 ; i<10; i++){
    let index = randomNum[i];
    displayText[randomDisplay[2*i]] = word[index].text;
    displayText[randomDisplay[2*i+1]] = word[index].meaning;
  }

  for(let j=0; j<20; j++){
    let displayIndex = randomDisplay.indexOf(j);
    let isEven  = displayIndex%2; //영어인지.한글인지 인덱스자리를 알아내어 확인
    //211,212번 코딩에 의하여 짝수는 영어, 홀수자리는 한글이다.
    let serialOrder;
    if(isEven == 0 ){
      // english(인덱스가 짝수)
      serialOrder = displayIndex/2;
      const li1 = document.createElement('li')
      li1.textContent = displayText[j]; //json data에 담겨있는 단어글자를 li에 표시
      li1.classList.add('word');
      li1.classList.add('text');
      li1.dataset.serial = randomNum[serialOrder];
      wordsList.append(li1);
    } else {
      //인덱스가 홀수. 즉 한글뜻을 나타낼 차례
      // Meaning
      serialOrder = (displayIndex-1)/2
      const li2 = document.createElement('li')
      li2.textContent = displayText[j];
      li2.classList.add('word');
      li2.classList.add('meaning');
      li2.dataset.serial = randomNum[serialOrder];
      wordsList.append(li2);
    }
  }
}

function randomArray(){
  randomNum.length = 0; //random배열 초기화
  array.length = 0;
  for (let j = 0; j<itemArray.length; j++){
    array.push(j);
  }
  //문제10개 랜덤추출
  for ( let i = 0; i < 10; i++){
    //0~9 사이 인덱스번호고르기
    let n = Math.floor(Math.random()*array.length);
    // 인덱스 번호에 있는 값을 빼서 num 에 넣기
    num = array.splice(n,1);
    // 빼내온 num을 randomNum에 차례로 배열로 집어넣기
    // 여기서 빼온 num도 배열이기 때문에 []을 써서 값만 꺼내옴
    randomNum.push(num[0]);
  }
  return randomNum;
};

function displayShuffle(){
  randomDisplay.length = 0;
  array.length = 0;
  for (let j = 0; j< 20; j++){
    array.push(j);
  }

  //자리순서 20개 지정
  for ( let i = 0; i < 20; i++){
    //0~9 사이 인덱스번호고르기
    let n = Math.floor(Math.random()*array.length);
    // 인덱스 번호에 있는 값을 빼서 num 에 넣기
    num = array.splice(n,1);
    // 빼내온 num을 randomNum에 차례로 배열로 집어넣기
    // 여기서 빼온 num도 배열이기 때문에 []을 써서 값만 꺼내옴
    randomDisplay.push(num[0]);
  }
  // randomNo.textContent = randomNum;
  return randomDisplay;
};



// 음성합성
function setVoiceList() {
  voices = window.speechSynthesis.getVoices();
  }
  function speech(txt) {
  if(!window.speechSynthesis) {
  alert("음성 재생을 지원하지 않는 브라우저입니다. 크롬, 파이어폭스 등의 최신 브라우저를 이용하세요");
  return;
  }
  var lang = 'en-US';//ko-KR
  var utterThis = new SpeechSynthesisUtterance(txt);
  utterThis.onend = function (event) {
  // console.log('end');
  };
  utterThis.onerror = function(event) {
  console.log('error', event);
  };
  var voiceFound = false;
  for(var i = 0; i < voices.length ; i++) {
  if(voices[i].lang.indexOf(lang) >= 0 || voices[i].lang.indexOf(lang.replace('-', '_')) >= 0) {
  utterThis.voice = voices[i];
  voiceFound = true;
  }
  }
  if(!voiceFound) {
  alert('voice not found');
  return;
  }
  utterThis.lang = lang;
  utterThis.pitch = 1;
  utterThis.rate = 1; //속도
  window.speechSynthesis.speak(utterThis);
  };