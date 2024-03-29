const title = document.querySelector('.title');
const userImg = document.querySelector('.user-img');
const unitText = document.querySelector('.unit');
const dictionary = document.querySelector('.dictionary');
const wordsList = document.querySelector('.words-list');
const speakList = document.querySelector('.speak-list');
const words = document.querySelector('.words');
const kor = document.querySelector('.kor');
const answer = document.querySelector('.answer');
const hint = document.querySelector('.hint');
const bottom = document.querySelector('.bottom');
const back = document.querySelector('.back');
const check = document.querySelector('.check');
const speakBtn = document.querySelector('.speakBtn');
const skpiBtn = document.querySelector('.skipBtn');
const checkGrammer = document.querySelector('.check-grammer');
let quizLeft = document.querySelector('.quiz-left'); 
let wordLeft = document.querySelector('.word-left'); 
let numOfQuiz = 10;
const reset = document.querySelector('.reset');
const score = document.querySelector('.score');
const scoreProgress = document.querySelector('.scoreProgress');
let scoreProgressValue;
const scoreToday = document.querySelector('.score-today');
const comboBox = document.querySelector('.combo-box');
const matchBtn = document.querySelector('.match');
const sentenceBtn = document.querySelector('.sentence');
const spellingBtn = document.querySelector('.spelling');
const clearBox = document.querySelector('.clearBox');
const playBtn = document.querySelector('.playBtn');
const character = document.querySelector('#character');
const audioYes = new Audio('audio/yes.mp3');
const audioNo = new Audio('audio/no.mp3');
const audioSkip = new Audio('audio/skip.wav');
const audioClear = new Audio('audio/clear.mp3');
let removeSpecialCha = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\’\'\(\"]/gi  //특수문자 제거 정규표현식
let today = new Date();
let thisMonth = `${today.getFullYear()}/${today.getMonth()+1}`;
let arrayLength;
let noOfRepeat; //speak문제에서 문장 두개 섞어서 단어 배열할 때 사용
let arrayLengthLeft;
let chapter; //전역정보로 어떤 단원의 단어를 풀지 선택
let quizType; //짝맞추기 문제를 풀지. speak문제를 풀지 선택
const array = [];
const undo = [];
let itemArray = []; //해당 unit에 속하는 모든 문제들 담기
let engArray = []; //speak퀴즈 낼 때, 한 문장에 있는 단어들을 분해해서 넣는 공간
let engArray2 = []; //speak퀴즈 낼 때, 다음 문장까지 단어를 섞어 낼 때 사용
let engArray3 = []; //speak퀴즈 낼 때, 다다음 문장까지 단어를 섞어 낼 때 사용
let engArrayAll = []; //speak퀴즈 낼 때, 섞을 모든 문장의 단어 합칠 때 사용
let engRandomArray = []; //해당 unit에 속하는 모든 문제들 담기
let answerCheck;
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
  displayItems(items); //DATA에서 랜덤으로 가져온 단어들을 word라는 변수에 할당
  //quizType이 matcing이면 짝맞추기 문제. speaking 이면 speaking 문제 내기
  quizLeft.textContent = word.length;
  //  quiZtype에 따라 matching, speaking, history 형태의 문제를 출제
  // grammer는 quizGrammer에 따로 있음
  if(quizType === 'matching'){
    displayShuffle(); //난수를 발생시켜 단어와 뜻을 섞음. 화면에 표시할 랜덤
    displayWords();
  } else if (quizType === 'speaking'){
    displaySpeakWords();
  } else if (quizType === 'history'){
    displayShuffleEven(); //난수를 발생시켜 뜻의 자리 섞기 위함
    displayHistoryWords();
  }
  
  
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
    scoreValue = parseInt(localStorage.getItem('scoreValue'));
    // scoreValue = scoreArray[unit-1]; //위의것 안되면 이거 다시 써야 함
    scoreProgressDisplay();
  }
}

function userImgDisplay(){
  userImg.style.backgroundImage = `url('../img/user${user}.png')`;
}

function scoreProgressDisplay(){
  scoreProgressValue = scoreValue / 400;
  // console.log(scoreValue)
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

function showMatchHideSpeaks(){
  
  // -----짝맞추기에 활용된 아이템들 보이기
  wordsList.style.display = 'grid';
  score.textContent = scoreValue;
  words.style.opacity = '1';

  //---- 스피킹에 활용된 아이템들 감추기
  speakList.style.display = 'none';
  bottom.style.display = 'none';
  kor.style.display = 'none';
  hint.style.display = 'none';
  answer.style.display = 'none';
  // answerBox.style.display = 'none';
  quizLeft.style.display = 'none';
  wordLeft.style.display = 'none';
  numOfQuiz = word.length;

}


function displayWords(){
  showMatchHideSpeaks(); //짝맞추기 아이템들은 보이고, 스피킹 아이템들은 감추고
  // matchedNo = 0;
  // combo = 0;
  wordsList.innerHTML = ''; //자리 차지하고 있던 li들 모두 제거
  for(let i=0 ; i<10; i++){
    let index = randomNum[i];
    displayText[randomDisplay[2*i]] = (scoreProgressValue >= 30 && word[index].sentence) ? word[index].sentence : word[index].text;
    displayText[randomDisplay[2*i+1]] = (scoreProgressValue >= 30 && word[index].sentence) ? word[index].sentenceMeaning :word[index].meaning;
  }

  for(let j=0; j<20; j++){
    let displayIndex = randomDisplay.indexOf(j);
    let isEven  = displayIndex%2; //영어인지.한글인지 인덱스자리를 알아내어 확인
    //172,173번 코딩에 의하여 짝수는 영어, 홀수자리는 한글이다.
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

//한국사 문제
function displayHistoryWords(){
  showMatchHideSpeaks(); //짝맞추기 아이템들은 보이고, 스피킹 아이템들은 감추고
  wordsList.innerHTML = ''; //자리 차지하고 있던 li들 모두 제거
  for(let i=0 ; i<10; i++){
    let index = randomNum[i];
    // 시기: 구석기, 신석기 등등
    displayText[2*i] =  word[index].text;

    // 그 시기에 대한 설명
    displayText[2*i+1] = word[index].meaning;

  }

// console.log(randomNum, displayText, randomDisplay);
  for(let j=0; j<10; j++){
    let index = randomNum[j];
    let meaningIndex = randomNum[randomDisplay[j]];
      // text(인덱스가 짝수)
      const li1 = document.createElement('li')
      li1.textContent = displayText[2*j]; //json data에 담겨있는 단어글자를 li에 표시
      li1.classList.add('word');
      li1.classList.add('text');
      li1.dataset.serial = index;
      wordsList.append(li1)

      
      // meaning(인덱스가 홀수)
      const li2 = document.createElement('li')
      li2.textContent = displayText[randomDisplay[j]*2+1];
      li2.classList.add('word');
      li2.classList.add('meaning');
      li2.dataset.serial = meaningIndex;
      wordsList.append(li2);
    }
  
}

function displaySpeakWords(){
  // -----짝맞추기에 활용된 아이템들 감추기
  wordsList.style.display = 'none';
  score.textContent = scoreValue;
  kor.textContent = '';
  hint.textContent = '';
  answer.textContent = '';
  speakList.textContent = '';
  words.style.opacity = '1';

  //---- 스피킹에 활용된 아이템들 보이기
  speakList.style.display = 'flex';
  bottom.style.display = 'flex';
  kor.style.display = 'block';
  hint.style.display = 'block';
  answer.style.display = 'flex';
  quizLeft.style.display = 'block';
  wordLeft.style.display = 'block';
  numOfQuiz = word.length;

  const li1 = document.createElement('li')
  // li1.textContent = word[randomNum[matchedNo]].sentenceMeaning ? word[randomNum[matchedNo]].sentenceMeaning : word[randomNum[matchedNo]].meaning; 
  li1.textContent = word[matchedNo].sentenceMeaning ? word[matchedNo].sentenceMeaning : word[matchedNo].meaning; 
  //json data에 담겨있는 단어의미(또는 문장의미)를 li에 표시 (sentenceMeaning이 있으면 그걸 우선 쓰라)
  li1.classList.add('lineCenter');
  kor.append(li1);

  const li3 = document.createElement('li')
  li3.textContent = word[matchedNo].hint ? word[matchedNo].hint : '';
  hint.append(li3);


//------------초반 3만점까지는 문장을 다 보여주고 speaking을 통해서 맞추게 함-------------------//
//------------------------------------------------------------------------------------------//
  if(scoreValue <= 30000){
  //답안 작성용 단어들을 보여주기만 하고, 선택은 못하게 함 (pointerEvents = none)
  speakList.textContent = word[matchedNo].sentence ? word[matchedNo].sentence : word[matchedNo].text;
  return;
}

  // engArray = word[randomNum[matchedNo]].sentence ? word[randomNum[matchedNo]].sentence.split(' ') : word[randomNum[matchedNo]].text.split(' ');
  engArray = word[matchedNo].sentence ? word[matchedNo].sentence.split(' ') : word[matchedNo].text.split(' ');
  noOfRepeat = engArray.length; // randomSpeakArray 에서 섞을 단어의 개수. (고정되어야 해서 noOfRepaet에 할당하는 것임)
  arrayLength = engArray.length; //reset(clear)버튼을 누르면 초기화 값으로 넣어야할 고정값
  arrayLengthLeft = engArray.length; //단어를 선택할 때마다 하나씩 차감할 예정
  
  // ---------난이도 상승! -------------------------------------------------------
  // scoreValue가 7만점을 넘으면 두 문장을 합쳐서 단어들 섞기
  if(scoreValue >= 70000) {
  let nextNo = matchedNo !== numOfQuiz-1 ? matchedNo+1 : 0; //두번째 문장에 쓰일 번호. 마지막 순번이면 다음 문장은 첫번째 문장
  engArray2 = word[nextNo].sentence ? word[nextNo].sentence.split(' ') : word[nextNo].text.split(' ');
  // engArray3 = word[nextNo+1].sentence ? word[nextNo+1].sentence.split(' ') : word[nextNo+1].text.split(' ');
  engArrayAll = [...engArray,...engArray2]
  // engArrayAll.length는 splice하면서 숫자가 계속 줄어들기 때문에 고정값으로 noOfRepeat에 할당해 줌.
} else { 
  // 점수가 7만점보다 작으면 한문장에서만 단어들 섞기
  engArrayAll = [...engArray]
}
  noOfRepeat = engArrayAll.length; // randomSpeakArray 에서 섞을 단어의 개수.
  
  randomSpeakArray();
  answerCheck = '';



  //---------- 난이도 상승 전 ----------------------------------
  // 원래 답안 문장의 단어들을 분리해서 섞어서 나열함--------------------
  for ( let i=0; i<noOfRepeat; i++){
    const li2 = document.createElement('li')
    // engRandomArray는 단어를 섞은 배열
    //나열된 단어들은 첫글자만 보여줄 때
    // li2.textContent = engRandomArray[i][0];

    //나열된 단어들
    li2.textContent = engRandomArray[i];
    li2.classList.add('eng')
    li2.classList.add('onList')
    // li2.style.pointerEvents = "none"
    speakList.append(li2);

    //answerCheck: 나중에 단어들의 초성만 따서 답안 맞추기 할 때 사용하려고 만들어 본 것임
    // answerCheck += engArray[i][0]; 

  }
  //-----------------------------------------------------------------------------------

  // console.log(answerCheck);
  console.log(arrayLengthLeft);
  wordLeft.innerHTML = `${arrayLengthLeft}`;
}




// ------------------------- BACK --------------------------------------//
back.addEventListener('click',()=>{
  //undo할 글자가 하나 이상 있으면
  if(undo.length >= 1){
    let lis = document.querySelectorAll('.eng');
    let undoNo = undo.pop();
    let undoLength = lis[undoNo].textContent.length;
    let textLength = answer.textContent.length;
    lis[undoNo].style.opacity = 1;
    lis[undoNo].classList.add("onList");
    answer.textContent = answer.textContent.substring(0,textLength-undoLength-1);
    arrayLengthLeft += 1;
    arrayLengthLeft = arrayLengthLeft = arrayLength ? arrayLengthLeft : arrayLength;
    wordLeft.textContent = arrayLengthLeft;
    // console.log(undoLength)
    // console.log(answer.textContent.length)
  }
})


// ------------------------- RESET --------------------------------------//
reset.addEventListener('click',()=>{
  let lis = document.querySelectorAll('.eng');
  resetSpeech();
  lis.forEach(li => {
    li.style.opacity = '1';
    li.classList.add('onList');
  })
  arrayLengthLeft = arrayLength;
  wordLeft.textContent = arrayLengthLeft;
})


//--------------------SPEAK SENTENCE-----------------------------//
speakBtn.addEventListener('click',()=>{
  speech(speakList.textContent);
})


//--------------------SKIP TO NEXT QUIZ ------------skipBtn 눌렀을 때 ----------------//
//  firebase2에 있음------------------------------------------------------------------//




//------------------------FUNCTIONS---------------------------------//
//------------------------FUNCTIONS---------------------------------//
//------------------------FUNCTIONS---------------------------------//
function resetSpeech(){
  answer.textContent = '';
  speechToText = '';
  interimTranscript = '';
}

function randomSpeakArray(){
  engRandomArray.length = 0; //random배열 초기화

  // array.length = 0; 
  // for (let i = 0; i<engArrayAll.length; i++){
  //   array.push(i);
  // }
  // for (let j=0; j<arrayLength; j++){
  for (let j=0; j<noOfRepeat; j++){
    // let n = Math.floor(Math.random()*engArray.length);
    let n = Math.floor(Math.random()*engArrayAll.length);

    // 인덱스 번호에 있는 값을 빼서 num 에 넣기
    // num = engArray.splice(n,1);
    num = engArrayAll.splice(n,1);
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

// 한국사에서 사용됨
function displayShuffleEven(){
  randomDisplay.length = 0;
  array.length = 0;
  for (let j = 0; j< 10; j++){
    array.push(j);
  }

  //자리순서 10개 지정
  for ( let i = 0; i < 10; i++){
    //0~9 사이 인덱스번호고르기
    let n = Math.floor(Math.random()*array.length);

    // 인덱스 번호에 있는 값을 빼서 num 에 넣기
    num = array.splice(n,1);
    randomDisplay.push(num[0]);
  }
  return randomDisplay;
};


// 짝맞추기에서 사용됨
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
  // 한국사 풀 때는 한국말로, 단어공부할 때는 영어로
  var lang = chapter !== '한국사' ? 'en-US': 'ko-KR' ;
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