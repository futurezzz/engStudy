const title = document.querySelector('.title');
const userImg = document.querySelector('.user-img');
const unitText = document.querySelector('.unit');
const dictionary = document.querySelector('.dictionary');
const wordsList = document.querySelector('.words-list');
const speakList = document.querySelector('.speak-list');
const grammerWords = document.querySelector('.grammer-words'); //quiz를 다 맞혔을 때 버튼이 나오기 전 퀴즈화면 안보이게 할 때 필요함
const quiz = document.querySelector('.quiz');
const answerView = document.querySelector('.answer-view');
const answerList = document.querySelector('.answer-list');
const checkGrammer = document.querySelector('.check-grammer');
let quizLeft = document.querySelector('.quiz-left'); //총 몇 문제 남았는지 표시


// 여기서부터 --------- js 오류방지를 위한 껍데기 DOM
const words = document.querySelector('.words');
const kor = document.querySelector('.kor');
const answer = document.querySelector('.answer');
const bottom = document.querySelector('.bottom');
const back = document.querySelector('.back');
const check = document.querySelector('.check');
let numOfQuiz;
const reset = document.querySelector('.reset');

let word = [];
let checkedE; //이미 선택된 영단어
let checkedK; //이미 선택된 한글뜻
let serialE; //이미 선택된 영단어
let serialK; //이미 선택된 한글뜻
var voices = [];
// --------------------------------------------------------------


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
let chapterForJSON; //전역정보로 어떤 단원의 단어를 풀지 선택
let chapterTitle; 
let quizType; //matching 문제를 풀지. speak문제를 풀지 선택, grammer를 풀지
const array = [];
const undo = [];
let itemArray = []; //해당 unit에 속하는 모든 문제들 담기
let engArray = []; //해당 unit에 속하는 모든 문제들 담기
let engRandomArray = []; //해당 unit에 속하는 모든 문제들 담기
const randomNum = []; //랜덤하게 나열한 문제순서
const randomDisplay = [];  // 추출한 문제와 뜻 총 20개 객체를 랜덤으로 화면에 표시
let displayText = [];
let scoreArray = [];
// let scoreSpeakArray = [];
let matchedNo; //문제 맞힐 때마다 1씩 증가. 
let scoreValue;
let scoreTodayValue;
let scoreTodayVariation = 0;
let combo = 0;
let decreaseNum = 20;//총 20요소. 영어10, 한글뜻10
let m;

//main
matchedNo = 0;
combo = 0;

hideQuizDOM(); //quiz에서 사용하던 DOM들 감추기
loadLocalStorage();
loadItems()
.then(items => {
  numOfQuiz = itemArray.length;
  randomArray(); //문제 섞기
  displayQuiz();
  // displayShuffle(); //난수를 발생시켜 단어와 뜻을 섞음. 화면에 표시할 랜덤
  // displayItems(items); //DATA에서 랜덤으로 가져온 단어들을 word라는 변수에 할당
  //quizType이 matcing이면 짝맞추기 문제. speaking 이면 speaking 문제 내기
  quizLeft.textContent = randomNum.length;
  
})
.catch(console.log);


function hideQuizDOM(){
  words.style.display = 'none';
  bottom.style.display = 'none';
  score.textContent = scoreValue;
  
}

function loadLocalStorage(){
  if(localStorage.getItem('unit')){
    user = localStorage.getItem('user');
    userImg.classList.add(`thumb${user}`);
    unit = localStorage.getItem('unit');
    chapter = localStorage.getItem('chapter');
    // chapterForJSON = localStorage.getItem('chapterForJSON');
    chapterTitle = localStorage.getItem('chapterTitle');
    quizType = localStorage.getItem('quizType');
    unitLength = parseInt(localStorage.getItem('unitLength'));
    scoreArray = JSON.parse(localStorage.getItem('scoreArray'));
    dateScoreArray = JSON.parse(localStorage.getItem('dateScoreArray'));
    scoreTodayValue = dateScoreArray[new Date().getDate()-1];
    scoreToday.textContent = scoreTodayValue;
    console.log(user,unit,chapter, unitLength);
    title.textContent = chapterTitle;
    unitText.textContent = `unit ${unit}`;
    scoreValue = parseInt(localStorage.getItem('scoreValue'));
    scoreProgressDisplay();
  }
}

function userImgDisplay(){
  userImg.style.backgroundImage = `url('../img/user${user}.png')`;
}

function scoreProgressDisplay(){
  scoreProgressValue = scoreValue / 400;
  console.log(scoreValue)
  if (scoreProgressValue >= 190) {
    scoreProgressValue = 200;
    scoreProgress.style.borderRadius = '10px'
  }
  scoreProgress.style.width = `${scoreProgressValue}px`
}


//DATA JSON 가져오기
async function loadItems(){
  const response = await fetch(`data/${chapter}.json`);
  const json = await response.json();
  itemArray = json.items
    .filter(item => item.unit == chapterTitle);
  return itemArray;
};


function displayItems(items){
  word = items.map(item=>item);
}












function randomArray(){
  randomNum.length = 0; //random배열 초기화
  array.length = 0;
  for (let j = 0; j<itemArray.length; j++){
    array.push(j);
  }
  //총 문제 수만큼 랜덤으로 배열하기
  for ( let i = 0; i < itemArray.length; i++){
    let n = Math.floor(Math.random()*array.length);
    // 인덱스 번호에 있는 값을 빼서 num 에 넣기
    num = array.splice(n,1);
    // 빼내온 num을 randomNum에 차례로 배열로 집어넣기
    // 여기서 빼온 num도 배열이기 때문에 []을 써서 값만 꺼내옴
    randomNum.push(num[0]);
  }
  return randomNum;
};

function displayShuffle(answerListNum){
  randomDisplay.length = 0;
  array.length = 0;
  for (let j = 0; j< answerListNum; j++){
    array.push(j);
  }

  //자리순서 지정
  for ( let i = 0; i < answerListNum; i++){
    //0~문제개수-1 사이 인덱스번호고르기
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



// ----Grammer 문제내기 -----------------------------------------------------

function displayQuiz(){
  score.textContent = scoreValue;
  let answerListNum;
  answerList.innerHTML = ''; //정답선택지 초기화
  quiz.textContent = itemArray[randomNum[matchedNo]]['QUIZ'];
  answerView.textContent = itemArray[randomNum[matchedNo]]['ANSWER'];
  // 정답 선택 리스트가 B까지만 있으면 선택지2개, C까지 3개, D까지 4개, E까지 있으면 5개 라는 의미
  if (!itemArray[randomNum[matchedNo]].C){
    answerListNum = 2
  } else if(!itemArray[randomNum[matchedNo]].D){
    answerListNum = 3
  } else if(!itemArray[randomNum[matchedNo]].E){
    answerListNum = 4
  } else {
    answerListNum = 5
  }

  displayShuffle(answerListNum); //정답 선택지를 섞기
  console.log(answerListNum, randomNum[matchedNo]+1, randomDisplay);
  for (let i=0; i< answerListNum; i++){
  let key;
  // let answerOrder = randomDisplay[i];
  switch(randomDisplay[i]){
    case 0:
      key = "A";
      break;
    case 1:
      key = "B";
      break;
    case 2:
      key = "C";
      break;
    case 3:
      key = "D";
      break;
    case 4:
      key = "E";
      break;
  }
  const li = document.createElement('li');
  li.innerHTML = `${i+1}. \u00a0 ${itemArray[randomNum[matchedNo]][key]}`;
  li.classList.add(key);
  // 한칸 띄우기, 한 칸, 공백 주기 \u00a0
  answerList.append(li);
  }
}

answerList.addEventListener('click',(e)=>{
  let elem = e.target;
  if((elem.classList.contains('answer-list'))){
    // 만일 Answer-list의 엄마(ul)을 선택하면 문단 종료
    return;
  };
  console.log(elem.classList.item(0));
  // 선택한 답이 ABCDE 중 어떤것인지 표시
  if (elem.classList.contains('answer-click')){
    elem.classList.remove('answer-click')
  } else{
    elem.classList.add('answer-click');
  }
})


//--------------사전 열어보기-------------------------------------//
dictionary.addEventListener('click',()=>{
  window.open("dictionary.html", "Dictionary", "toolbar=no, menubar=no, scrollbars=yes, resizable=no, width=700, height=700, left=0, top=0" );
})





checkGrammer.addEventListener('click',(e)=>{
  let checked = document.querySelectorAll('.answer-click');
  let checkedAnswer = '';
  let answer = itemArray[randomNum[matchedNo]]['ANSWER'];
    
    //보기를 하나도 선택하지 않았거나 정답수 만큼 선택하지 않으면 중지하라
  if (checked.length !== answer.length){
    alert(`보기를 ${answer.length}개 선택하세요`);
    return;
  }
  
  // console.log(answer, checked.length, checked.item(0).classList.item(0));
  for (let i=0; i<checked.length; i++){
    // checkedArray.push(checked.item(i).classList.item(0));
    checkedAnswer += checked.item(i).classList.item(0);
  }
  checkedAnswer = checkedAnswer.split('').sort().join('') //문자열 오름차순 정렬
  if( checkedAnswer === answer){
    let speakAnswer = answer.length === 1 ? answer : checked.item(0).classList.item(0);
    console.log(itemArray[randomNum[matchedNo]][speakAnswer])
    checkGrammerYes(speakAnswer);
  } else {
    // grammer 퀴즈에서 틀렸을 때
    checked.forEach(elem => elem.classList.remove('answer-click'));
    scoreSubtract();
  };
});



//grammer퀴즈에서 정답을 맞혔을 때 사용
function checkGrammerYes(answer){
  let speakingText = quiz.textContent.replace('___',itemArray[randomNum[matchedNo]][answer])
  // 문제에 있는 ___ 빈칸을 처음 선택한 정답으로 교체한 후 읽어주기
  speech(speakingText);
  // 기존에는 speech가 끝나면 다음 문제를 출제하도록 했었음. onend. 
  // 다음 퀴즈 기다리기가 지루해서 지금과 같이 바꿈
  
  //정답이면 100점씩 증가.
  scoreAdd(150); 
  nextQuiz();

  setTimeout(()=>{
    comboBox.classList.remove('combo-boxOn');
  },1000)
}


//퀴즈에서 맞히면 점수 증가
function scoreAdd(add){
  audioYes.play();
  scoreValue += add + combo*10;
  
  scoreTodayVariation = scoreTodayVariation + add + combo*10;
  score.textContent = scoreValue;
  scoreToday.textContent = scoreTodayValue + scoreTodayVariation;
  
  // 연속 정답수(combo)가 0보다 크면 화면에 combo표시
  if(combo>0){
    comboBox.innerHTML = `${combo} combo!`;
    comboBox.classList.add('combo-boxOn');
} 
combo++;
matchedNo++;
// console.log(numOfQuiz, matchedNo, scoreValue)
quizLeft.textContent = numOfQuiz - matchedNo;
}



//퀴즈에서 틀리면 점수 감소
function scoreSubtract(){
  audioNo.play();
  scoreValue -= 50;
  scoreTodayVariation -= 50;
  combo = 0;
  score.textContent = scoreValue;
  scoreToday.textContent = scoreTodayValue + scoreTodayVariation;
}


function speech(txt) {
  if(!window.speechSynthesis) {
  alert("음성 재생을 지원하지 않는 브라우저입니다. 크롬, 파이어폭스 등의 최신 브라우저를 이용하세요");
  return;
  }
  
  // 한국사 풀 때는 한국말로, 단어공부할 때는 영어로
  var lang = chapter !== '한국사' ? 'en-US': 'ko-KR' ;
  // var lang = 'en-US';//ko-KR
  var utterThis = new SpeechSynthesisUtterance(txt);
  //음성합성이 끝나면 onend
  utterThis.onend = function (event) {
    //문장을 읽고 나면 

  };
  utterThis.onerror = function(event) {
  console.log('error', event);
  };

  utterThis.lang = lang;
  utterThis.pitch = 1;
  utterThis.rate = 1; //속도
  window.speechSynthesis.speak(utterThis);
};





function nextQuiz(){
  
  // 10문제 다 맞히면 클리어. platBtn 활성화
  // speak페이지에선 unit개수를 다 맞춰야 함. 보통 20~25개
  // if(matchedNo === 2 ){
  if(matchedNo === numOfQuiz ){
    grammerWords.style.display = 'none'; 
    checkGrammer.style.display = 'none';
    afterClearQuiz();
    }
    //아직 주어진 문제들을 다 맞히지 못했다면 또 다른 문제 출제
    else {
    displayQuiz();
    }
  
}


//주어진 문제 맞춘 후 캐릭터 나오면서 큰 버튼 나오기
function afterClearQuiz(){
  character.classList.remove(`charater0${m}`);
  setTimeout(()=>{
    audioClear.play();
    
    m = Math.floor(Math.random()*10);
    // console.log(m);
    character.classList.add(`charater0${m}`);
    clearBox.style.display = 'block'; //버튼 보이기
    scoreProgressDisplay();
    if (scoreValue > 100){
      playBtn.classList.add('playBtnClear'); //버튼 색깔 바뀌는 css추가
      playBtn.innerText = 'YOU DID IT!';
    }
    words.style.opacity = '0';
    InsertData();
  },300)
}

