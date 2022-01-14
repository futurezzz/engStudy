const title = document.querySelector('.title');
const unitText = document.querySelector('.unit');
const wordsList = document.querySelector('.words-list');
const score = document.querySelector('.score');
const scoreProgress = document.querySelector('.scoreProgress');
const comboBox = document.querySelector('.combo-box');
const clearBox = document.querySelector('.clearBox');
const playBtn = document.querySelector('.playBtn');
const character = document.querySelector('#character');
const audioYes = new Audio('audio/yes.mp3');
const audioNo = new Audio('audio/no.mp3');
const audioClear = new Audio('audio/clear.mp3');
let chapter; //전역정보로 어떤 단원의 단어를 풀지 선택
const array = [];
let itemArray = [];
const randomNum = [];
let matchedNo;
let scoreValue = 0;
let combo = 0;
let decreaseNum = 20;//총 20요소. 영어10, 한글뜻10
let word = [];
let checkedE; //이미 선택된 영단어
let checkedK; //이미 선택된 한글뜻
let serialE; //이미 선택된 영단어
let serialK; //이미 선택된 한글뜻
var voices = [];

//main
loadItems()
.then(items => {
  randomArray(); //난수를 발생시켜 단어와 뜻을 섞음
  displayItems(items);
  displayWords();
})
.catch(console.log);


setVoiceList();
if (window.speechSynthesis.onvoiceschanged !== undefined) {
window.speechSynthesis.onvoiceschanged = setVoiceList;
}

if(localStorage.getItem('unit')){
  unit = localStorage.getItem('unit');
  chapter = localStorage.getItem('chapter');
  console.log(unit,chapter);
  title.textContent = chapter;
  unitText.textContent = `unit ${unit}`;
}

wordsList.addEventListener('click',(e)=>{
  // console.log(e.target.textContent);
  let elem = e.target.classList;
  // 이전에 선택된 요소를 기억했다가 다음 같은 요소(영어 또는 뜻)선택시 이전요소의 색깔 원상복귀
  let isAvailable = elem.contains("words-list");
  if(!isAvailable){
    //선택된 것이 영단어이고
    if(elem.contains('text')){
    // 이미 선택된 영단어가 있으면 선택을 해제하고 현재 선택요소만 진하게
      if(checkedE){
        checkedE.replace('textOn','text')
      }
      elem.replace('text','textOn')
      speech(e.target.textContent);
      serialE = e.target.dataset.serial;
      checkedE = elem;
      //선택된 것이 한글뜻이고
    }else if(elem.contains('meaning')){
      // 이미 선택된 한글뜻이 있으면 선택을 해제하고 현재 선택요소만 진하게
      if(checkedK){
        checkedK.replace('meaningOn','meaning')
      }
      elem.replace('meaning','meaningOn')
      serialK = e.target.dataset.serial;
      checkedK = elem;
    }
    // 선택된 영단어와 한글뜻이 일치하면
    if(serialE === serialK){
    audioYes.play();
    scoreValue = scoreValue + 100 + combo*10;
    score.textContent = scoreValue;
    // 연속 정답수(combo)가 0보다 크면 화면에 combo표시
    if(combo>0){
      comboBox.innerHTML = `${combo} combo!`;
      comboBox.classList.add('combo-boxOn');
    }
    combo++;
    matchedNo++;
    // console.log(matchedNo);
    setTimeout(()=>{
      checkedE.add('hide');
      checkedK.add('hide');
      checkedE = '';
      checkedK = '';
    },100)
    setTimeout(()=>{
      comboBox.classList.remove('combo-boxOn');
    },500)
    // 10문제 다 맞히면 클리어. platBtn 활성화
    if(matchedNo === 2 ){
      setTimeout(()=>{
        audioClear.play();
        let m = Math.floor(Math.random()*4+1);
        console.log(m);
        character.style.backgroundImage = `url('../image/character0${m}.png')`;
        clearBox.style.display = 'block';
        let scoreProgressValue = scoreValue / 50;
        scoreProgress.style.width = `${scoreProgressValue}px`
        // console.log(scoreValue);
        if (scoreValue > 100){
          playBtn.classList.add('playBtnClear'); //버튼 색깔 바뀌는 css추가
          playBtn.innerText = 'YOU DID IT!';
        }
        checkedE = '';
        checkedK = '';
        serialE = '';
        serialK = '';
      },300)
    }
    // 선택된 영단어와 한글뜻이 각각 있고 서로 다르면
  } else if(checkedE && checkedK && serialE !== serialK){
    audioNo.play();
    scoreValue -= 50;
    combo = 0;
    score.textContent = scoreValue;
    setTimeout(()=>{
      checkedE.replace('textOn','text')
      checkedK.replace('meaningOn','meaning')
      checkedE = '';
      checkedK = '';
      serialE = '';
      serialK = '';
    },120)
  }
}
});

// 10문제 맞힌 후 play 버튼 활성화.
// 이 play버튼을 누르면 다시 게임 시작
playBtn.addEventListener('click',()=>{
  clearBox.style.display = 'none';
  randomArray(); //난수를 발생시켜 단어와 뜻을 섞음
  displayWords();

})


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
  const response = await fetch('data/data.json');
  const json = await response.json();
  itemArray = json.items
    .filter(item => item.chapter == chapter && item.unit == unit);
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
  for(let i=0 ; i<20; i++){
    let index = randomNum[i];
    let isEven = index%2;
    if(isEven === 0 ){
      // english(인덱스가 짝수)
      const li1 = document.createElement('li')
      li1.textContent = word[index].text; //json data에 담겨있는 단어글자를 li에 표시
      li1.classList.add('word');
      li1.classList.add('text');
      li1.dataset.serial = word[index].serial;
      wordsList.append(li1);
    } else {
      //인덱스가 홀수. 즉 한글뜻을 나타낼 차례
      // Meaning
      index -= 1;
      const li2 = document.createElement('li')
      li2.textContent = word[index].meaning;
      li2.classList.add('word');
      li2.classList.add('meaning');
      li2.dataset.serial = word[index].serial;
      wordsList.append(li2);

    }
  }
}

function randomArray(){
  randomNum.length = 0; //random배열 초기화
  for (let j = 0; j<20; j++){
    array.push(j);
  }
  
  for ( let i = 0; i < 20; i++){
    //0~9 사이 인덱스번호고르기
    let n = Math.floor(Math.random()*array.length);
    // 인덱스 번호에 있는 값을 빼서 num 에 넣기
    num = array.splice(n,1);
    // 빼내온 num을 randomNum에 차례로 배열로 집어넣기
    // 여기서 빼온 num도 배열이기 때문에 []을 써서 값만 꺼내옴
    randomNum.push(num[0]);
  }
  // randomNo.textContent = randomNum;
  return randomNum;
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