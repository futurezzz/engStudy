const title = document.querySelector('.title');
const userImg = document.querySelector('.user-img');
const unitText = document.querySelector('.unit');
const dictionary = document.querySelector('.dictionary');
const wordsList = document.querySelector('.words-list');
const speakList = document.querySelector('.speak-list');
const words = document.querySelector('.words');
const kor = document.querySelector('.kor');
const answer = document.querySelector('.answer');
const bottom = document.querySelector('.bottom');
const back = document.querySelector('.back');
const check = document.querySelector('.check');
let quizLeft = document.querySelector('.quiz-left'); //짝맞추기 문제를 풀지. speak문제를 풀지 선택
let numOfQuiz = 10;
let answerTry;
const reset = document.querySelector('.reset');
const score = document.querySelector('.score');
const scoreProgress = document.querySelector('.scoreProgress');
let scoreProgressValue;
const scoreToday = document.querySelector('.score-today');
const comboBox = document.querySelector('.combo-box');
const clearBox = document.querySelector('.clearBox');
const playBtn = document.querySelector('.playBtn');
const character = document.querySelector('#character');
const audioYes = new Audio('audio/yes.mp3');
const audioNo = new Audio('audio/no.mp3');
const audioClear = new Audio('audio/clear.mp3');
let removeSpecialCha = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\’\'\(\"]/gi  //특수문자 제거 정규표현식
let today = new Date();
let thisMonth = `${today.getFullYear()}/${today.getMonth()+1}`;
let arrayLength;
let arrayLengthLeft;
let chapter; //전역정보로 어떤 단원의 단어를 풀지 선택
let quizType; //짝맞추기 문제를 풀지. speak문제를 풀지 선택
const array = [];
const undo = [];
let itemArray = []; //해당 unit에 속하는 모든 문제들 담기
let engArray = []; //해당 unit에 속하는 모든 문제들 담기
let engRandomArray = []; //해당 unit에 속하는 모든 문제들 담기
const randomNum = []; //문제 10개 랜덤추출
const randomDisplay = [];  // 추출한 문제와 뜻 총 20개 객체를 랜덤으로 화면에 표시
let displayText = [];
let scoreArray = [];
// let scoreSpeakArray = [];
let matchedNo; //문제 맞힐 때마다 1씩 증가. 10문제 다 맞히면 화면reset
let scoreValue;
let scoreTodayValue;
let scoreTodayVariation = 0;
let combo = 0;
let decreaseNum = 20;//총 20요소. 영어10, 한글뜻10
let word = [];
let checkedE; //이미 선택된 영단어
let checkedK; //이미 선택된 한글뜻
let serialE; //이미 선택된 영단어
let serialK; //이미 선택된 한글뜻
var voices = [];

//main
matchedNo = 0;
combo = 0;


loadLocalStorage();
loadItems()
.then(items => {
  randomArray(); //DATA JASON파일 중 해당 유닛 문제 10개 랜덤추출
  displayShuffle(); //난수를 발생시켜 단어와 뜻을 섞음. 화면에 표시할 랜덤
  displayItems(items); //DATA에서 랜덤으로 가져온 단어들을 word라는 변수에 할당
  //quizType이 matcing이면 짝맞추기 문제. speaking 이면 speaking 문제 내기
  quizLeft.textContent = word.length;
  quizType === "matching" ? displayWords() : displaySpeakWords()
  
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
    quizType = localStorage.getItem('quizType');
    unitLength = parseInt(localStorage.getItem('unitLength'));
    scoreArray = JSON.parse(localStorage.getItem('scoreArray'));
    dateScoreArray = JSON.parse(localStorage.getItem('dateScoreArray'));
    scoreTodayValue = dateScoreArray[new Date().getDate()-1];
    scoreToday.textContent = scoreTodayValue;
    console.log(user,unit,chapter, unitLength);
    title.textContent = chapter;
    unitText.textContent = `unit ${unit}`;
    scoreValue = scoreArray[unit-1];
    scoreProgressDisplay();
  }
}

function userImgDisplay(){
  userImg.style.backgroundImage = `url('../img/user${user}.png')`;
}

function scoreProgressDisplay(){
  scoreProgressValue = scoreValue / 200;
  console.log(scoreValue)
  if (scoreProgressValue >= 190) {
    scoreProgressValue = 200;
    scoreProgress.style.borderRadius = '10px'
  }
  scoreProgress.style.width = `${scoreProgressValue}px`
}



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
  word = items.map(item=>item);
}

function displayWords(){
  score.textContent = scoreValue;
  bottom.style.display = 'none';
  reset.style.display = 'none';
  back.style.display = 'none';
  check.style.display = 'none';
  quizLeft.style.display = 'none';
  // matchedNo = 0;
  // combo = 0;
  wordsList.innerHTML = ''; //자리 차지하고 있던 li들 모두 제거
  for(let i=0 ; i<10; i++){
    let index = randomNum[i];
    displayText[randomDisplay[2*i]] = (scoreProgressValue >= 50 && word[index].sentence) ? word[index].sentence : word[index].text;
    displayText[randomDisplay[2*i+1]] = (scoreProgressValue >= 50 && word[index].sentence) ? word[index].sentenceMeaning :word[index].meaning;
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

function displaySpeakWords(){

  score.textContent = scoreValue;
  kor.textContent = '';
  answer.textContent = '';
  speakList.textContent = '';
  words.style.opacity = '1';
  numOfQuiz = word.length;

  const li1 = document.createElement('li')
  // li1.textContent = word[randomNum[matchedNo]].sentenceMeaning ? word[randomNum[matchedNo]].sentenceMeaning : word[randomNum[matchedNo]].meaning; 
  li1.textContent = word[matchedNo].sentenceMeaning ? word[matchedNo].sentenceMeaning : word[matchedNo].meaning; 
  //json data에 담겨있는 단어글자를 li에 표시 (sentenceMeaning이 있으면 그걸 우선 쓰라)
  li1.classList.add('kor');
  kor.append(li1);

  // engArray = word[randomNum[matchedNo]].sentence ? word[randomNum[matchedNo]].sentence.split(' ') : word[randomNum[matchedNo]].text.split(' ');
  engArray = word[matchedNo].sentence ? word[matchedNo].sentence.split(' ') : word[matchedNo].text.split(' ');
  arrayLength = engArray.length;
  arrayLengthLeft = engArray.length; //단어를 선택할 때마다 하나씩 차감할 예정
  randomSpeakArray();
  for ( let i=0; i<arrayLength; i++){
    const li2 = document.createElement('li')
    li2.textContent = engRandomArray[i];
    li2.classList.add('eng')
    speakList.append(li2);
  }
}


// ------------------------- BACK --------------------------------------//
back.addEventListener('click',()=>{
  //undo할 글자가 하나 이상 있으면
  if(undo.length >= 1){
    let lis = document.querySelectorAll('.eng');
    let undoNo = undo.pop();
    let undoLength = lis[undoNo].textContent.length;
    let textLength = answer.textContent.length;
    lis[undoNo].style.opacity = '1';
    answer.textContent = answer.textContent.substring(0,textLength-undoLength-1);
    arrayLengthLeft += 1;
    console.log(undoLength)
    console.log(answer.textContent.length)
  }
})


// ------------------------- RESET --------------------------------------//
reset.addEventListener('click',()=>{
  let lis = document.querySelectorAll('.eng');
  resetSpeech();
  lis.forEach(li => li.style.opacity = '1')
  arrayLengthLeft = arrayLength;
})

function resetSpeech(){
  answer.textContent = '';
  speechToText = '';
  interimTranscript = '';
}

function randomSpeakArray(){
  engRandomArray.length = 0; //random배열 초기화
  array.length = 0;
  for (let i = 0; i<arrayLength; i++){
    array.push(i);
  }
  for (let j=0; j<arrayLength; j++){
    let n = Math.floor(Math.random()*engArray.length);

    // 인덱스 번호에 있는 값을 빼서 num 에 넣기
    num = engArray.splice(n,1);

    // console.log(num)
    // 빼내온 num을 randomNum에 차례로 배열로 집어넣기
    // 여기서 빼온 num도 배열이기 때문에 []을 써서 값만 꺼내옴
    engRandomArray.push(num[0]);
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
    //0~19 사이 인덱스번호고르기
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



// ------------------------- 음성합성 --------------------------------------//
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




//-------------MIC와 음성인식에 관한 코드-------------------------
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

// 인스턴스 생성
const recognition = new SpeechRecognition();
let toggle = true;
// recognition.interimResults 가 true면 말하는 동안 연속으로 음절을 인식하나 
// false면 말하기가 끝나면 음절을 인식한다.
recognition.interimResults = true;
// 값이 없으면 HTML의 <html lang="en">을 참고합니다. ko-KR, en-US
recognition.lang = "en-US";
// true means continuous, and false means not continuous (single result each time.)
// true면 음성 인식이 안 끝나고 계속 됩니다.
recognition.continuous = true;
// 숫자가 작을수록 발음대로 적고, 크면 문장의 적합도에 따라 알맞은 단어로 대체합니다.
// maxAlternatives가 크면 이상한 단어도 문장에 적합하게 알아서 수정합니다.
recognition.maxAlternatives = 100;

let mic = document.querySelector(".mic")
let speechToText = ""; 
recognition.addEventListener("result", e => {
  // let interimTranscript = '';
  for (let i = e.resultIndex, len = e.results.length; i < len; i++) {
    speechToText = e.results[i][0].transcript;
    // let transcript = e.results[i][0].transcript;
    // if (e.results[i].isFinal) {
    //   speechToText += transcript;
    // } else {
    //   interimTranscript += transcript;
    // }
    // // console.log(interimTranscript);
    // interimTranscript = transcript;
  }

  recognition.addEventListener('soundend', () => {
    mic.style.backgroundColor = null;
  });
  answer.innerHTML = speechToText;
})


mic.addEventListener("click", () => {
  if (toggle) {
    recognition.start();
    toggle = false;
    mic.style.backgroundColor = "#BDE5E5"
  }
  else {
    recognition.stop();
    toggle = true;
    mic.style.backgroundColor = null;
  }

})


//--------------사전 열어보기-------------------------------------//
dictionary.addEventListener('click',()=>{
  window.open("dictionary.html", "Dictionary", "toolbar=no, menubar=no, scrollbars=yes, resizable=no, width=700, height=700, left=0, top=0" );
})