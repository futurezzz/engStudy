
// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCyvxJ4o69EA98FUQHjpoKlVoEuPakISvE",
    authDomain: "english-study-337311.firebaseapp.com",
    projectId: "english-study-337311",
    storageBucket: "english-study-337311.appspot.com",
    messagingSenderId: "776839753287",
    appId: "1:776839753287:web:3f72d5e6dfe55ff28bcb62"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  let m;

  import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

    const db = getDatabase();


// REFERENCE //
let value;


  SelectData();
  SelectTodayData();


// 10문제 맞힌 후 play 버튼 활성화.
// 이 play버튼을 누르면 다시 게임 시작
playBtn.addEventListener('click',(e)=>{
  resetData();
})

function resetData(){
  matchedNo = 0;
  combo = 0;
  clearBox.style.display = 'none';
  console.log(thisMonth);
  randomArray(); //난수를 발생시켜 단어와 뜻을 섞음
  displayShuffle(); //난수를 발생시켜 단어와 뜻을 섞음. 화면에 표시할 랜덤
  // displayItems(items);

  if (scoreValue >= 70000){
    quizType = "speaking"
  } else if (scoreValue >= 65000){
    quizType = "matching"
  }else if (scoreValue >= 50000){
    quizType = "speaking";
  } else if (scoreValue >= 45000){
    quizType = "matching";
  } else if (scoreValue >= 30000){
    quizType = "speaking"
  } else if (scoreValue >= 25000){
    quizType = "matching";
  } else if (scoreValue >= 15000){
    quizType = "speaking"
  } else {
    quizType = "matching"
  }
if (chapter === 'GRIU') {
  quizType = 'grammer';
}

  //  quiZtype에 따라 matching, speaking, grammer 형태의 문제를 출제
  switch(quizType) {
    case "sepaking":
      displaySpeakWords();
      break;
    case "grammer":
      // grammerWords.style.display = 'flex'; 
      checkGrammer.style.display = 'block';
      quizLeft.textContent = randomNum.length;
      displayQuiz();
      break; 
    default:
      displayWords();
  }
  // 아래는 위의 switch 문을 쓰기 전에 쓰던 문법
  // quizType === "matching" ? displayWords() : displaySpeakWords()
}

// ----------- SELECT DATA FUNCTION ---------------------------------// 
    //선택한 단원에 해당하는 각 unit점수들 불러오기 
async function SelectData(){
  const dbref = ref(db);
  await get(child(dbref, `${user}/` + chapter)).then((snapshot)=>{
    if(snapshot.exists()){
      scoreArray = snapshot.val().Score;
      // scoreSpeakArray = snapshot.val().ScoreSpeak;
    }
        //firebase데이터에 아무것도 없을 경우
        //unit개수만큼 점수0을 넣은 scoreArray를 생성한다.
        else {
          //새로운 배열을 만들고 각 자리에 0을 채운다.
          scoreArray = new Array(unitLength).fill(0); 
          // scoreSpeakArray = new Array(unitLength).fill(0); 
        }
      })
      .catch((error)=>{
        alert("unsuccessful, error" + error);
      });
    }

async function SelectTodayData(){
  const dbref = ref(db);
  await get(child(dbref, `${user}/` + 'calendar'+ `/${thisMonth}`)).then((snapshot)=>{
    if(snapshot.exists()){
      dateScoreArray = snapshot.val().DateScore;
      
    }
        //firebase데이터에 아무것도 없을 경우
        //unit개수만큼 점수0을 넣은 scoreArray를 생성한다.
        else {
          //새로운 배열을 만들고 0을 채운다. 배열의 자릿수는 해당월의 날짜만큼이다.(lastDayOfMonth)
          dateScoreArray = new Array(lastDayOfMonth).fill(0); 
        }
        // console.log(dateScoreArray)
      })
      .catch((error)=>{
        alert("unsuccessful, error" + error);
      });
    }

    
    // ----------- INSERT DATA FUNTION ---------------------------------//    
function InsertData(){
  
  // quizType === "matching" ? scoreArray[unit-1] = scoreValue : scoreSpeakArray[unit-1] = scoreValue;
  scoreArray[unit-1] = scoreValue;
  scoreTodayValue = dateScoreArray[new Date().getDate()-1];
  dateScoreArray[new Date().getDate()-1] = scoreTodayValue + scoreTodayVariation;
  scoreTodayValue = scoreTodayValue + scoreTodayVariation;
  scoreTodayVariation = 0;
  set(ref(db, `${user}/` + chapter), {
        Score : scoreArray,
        // ScoreSpeak : scoreSpeakArray
      })
      .then(() => {
        // alert("data stored successfully");
      })
      .catch((error)=>{
        alert("unsuccessful, error" + error);
      });
  set(ref(db, `${user}/` + 'calendar' + `/${thisMonth}`), {
        DateScore : dateScoreArray
      })
      .then(() => {
        // alert("data stored successfully");
      })
      .catch((error)=>{
        alert("unsuccessful, error" + error);
      });
    }

//speakQuiz에서 사용되는 코딩
speakList.addEventListener('click',(e)=>{
  let elem = e.target
  if(elem.classList.contains("onList")) {
    let text = elem.textContent;

    speech(elem.textContent);
    answer.textContent = answer.textContent ? `${answer.textContent} ${text}` : `${text}`;
    elem.style.opacity = "0";
    elem.classList.remove("onList");
    arrayLengthLeft -= 1;
    // undo배열에 내가 몇번째 영어 단어를 선택했는지 기록.
    // undo 누를 때마다 하나씩 복원
    undo.push(engRandomArray.indexOf(text));
    // console.log(undo) 
    // console.log(arrayLengthLeft);
    // console.log(engRandomArray.indexOf(text))

    //나열된 영어 단어를 문장으로 다 만들면 맞았나 틀렸나 확인
    if (arrayLengthLeft === 0){ 
       //정답이면
      if (answer.textContent === (word[matchedNo].sentence ? word[matchedNo].sentence : word[matchedNo].text)){
        checkAnswerYes();
    }

      // 오답이면
      else {
        checkAnswerNo();
      }
    }
  }
})


checkGrammer.addEventListener('click',(e)=>{
  let checked = document.querySelectorAll('.answer-click');
  let checkedAnswer = '';
  let answer = itemArray[randomNum[quizNo]]['ANSWER'];
  console.log(answer, checked.length, checked.item(0).classList.item(0));
  for (let i=0; i<checked.length; i++){
    // checkedArray.push(checked.item(i).classList.item(0));
    checkedAnswer += checked.item(i).classList.item(0);
  }
  
  checkedAnswer = checkedAnswer.split('').sort().join('') //문자열 오름차순 정렬
  if( checkedAnswer === answer){
    let speakAnswer = answer.length === 1 ? answer : checked.item(0).classList.item(0);
    console.log(itemArray[randomNum[quizNo]][speakAnswer])
    checkGrammerYes(speakAnswer);
  } else {
    // grammer 퀴즈에서 틀렸을 때
    checked.forEach(elem => elem.classList.remove('answer-click'));
    scoreSubtract();
  };
});



//grammer퀴즈에서 정답을 맞혔을 때 사용
function checkGrammerYes(answer){
  let speakingText = quiz.textContent.replace('___',itemArray[randomNum[quizNo]][answer])
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

function nextQuiz(){
  
    // 10문제 다 맞히면 클리어. platBtn 활성화
    // speak페이지에선 unit개수를 다 맞춰야 함. 보통 20~25개
    if(matchedNo === numOfQuiz ){
      // grammerWords.style.display = 'none'; 
      checkGrammer.style.display = 'none';
      afterClearQuiz();
      }
      //아직 주어진 문제들을 다 맞히지 못했다면 또 다른 문제 출제
      else {
      displayQuiz();
      }
    
}




// 마이크로 말하고 check버튼을 누르면 정답인지 확인
check.addEventListener('click',()=>{
  checkSpeakAnswer();
})

function checkSpeakAnswer(){
  // let answerTrans = word[randomNum[matchedNo]].sentence? word[randomNum[matchedNo]].sentence.toLowerCase().replace('gotta','got to').replace('gonna','going to').replace('wanna','want to').replace("'ll"," will").replace("'re"," are").replace(removeSpecialCha,"") : word[randomNum[matchedNo]].text.toLowerCase().replace('gotta','got to').replace('gonna','going to').replace('wanna','want to').replace("'ll"," will").replace("'re"," are").replace(removeSpecialCha,"");
  let answerTrans = word[matchedNo].sentence? word[matchedNo].sentence.toLowerCase().replace('gotta','got to').replace('gonna','going to').replace('wanna','want to').replace("'ll"," will").replace("'re"," are").replace(removeSpecialCha,"") : word[matchedNo].text.toLowerCase().replace('gotta','got to').replace('gonna','going to').replace('wanna','want to').replace("'ll"," will").replace("'re"," are").replace(removeSpecialCha,"");
  //말한 답을 모두 소문자로 바꾸고 앞의 공백을 지우라.replace(/^\s*/, "")
  if (answerTrans === answer.textContent.toLocaleLowerCase().replace(/^\s*/, "").replace("'ll"," will").replace("'re"," are").replace(removeSpecialCha,"")){
    checkAnswerYes();
  }
  else{
    // console.log(answerTrans);
    // console.log(answer.textContent.toLocaleLowerCase().replace(/^\s*/, "").replace("'ll"," will").replace("'re"," are").replace(removeSpecialCha,""))
    checkAnswerNo();
  }
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

//주어진 문제 맞춘 후 캐릭터 나오면서 큰 버튼 나오기
function afterClearQuiz(){
  character.classList.remove(`charater0${m}`);
  setTimeout(()=>{
    audioClear.play();
    
    m = Math.floor(Math.random()*10);
    // console.log(m);
    character.classList.add(`charater0${m}`);
    clearBox.style.display = 'block';
    scoreProgressDisplay();
    if (scoreValue > 100){
      playBtn.classList.add('playBtnClear'); //버튼 색깔 바뀌는 css추가
      playBtn.innerText = 'YOU DID IT!';
    }
    words.style.opacity = '0';
    InsertData();
  },300)
}


//speak 퀴즈에서 정답을 맞혔을 때 사용    
function checkAnswerYes(){
       //정답이면 200점씩 증가.
      scoreAdd(200); 
      // answer.style.color = '#98d0d0';
      setTimeout(()=>{
        comboBox.classList.remove('combo-boxOn');
        resetSpeech();
        // answer.style.color = '#000';
      },1000)
    // 10문제 다 맞히면 클리어. platBtn 활성화
    // speak페이지에선 unit개수를 다 맞춰야 함. 보통 20~25개
      if(matchedNo === numOfQuiz ){
        afterClearQuiz();
      }
      //아직 주어진 문제들을 다 맞히지 못했다면 또 다른 문제 출제
      else {
        displaySpeakWords();
      }
    }


function checkAnswerNo(){
  scoreSubtract()
  // answer.style.color = '#98d0d0';
  setTimeout(()=>{
    resetSpeech();
    // answer.style.color = '#000';
  },1000)
  displaySpeakWords();
}


// quiz.js 에서 가져옴--짝맞추기에 쓰이는 코딩------------------------------------------------------
wordsList.addEventListener('click',(e)=>{
  // console.log(e.target.textContent);
  let elem = e.target.classList;
  // 이전에 선택된 요소를 기억했다가 다음 같은 요소(영어 또는 뜻)선택시 이전요소의 색깔 원상복귀
  let isAvailable = elem.contains("words-list");
  if(!isAvailable){
    
    //선택된 것이 영단어이고. 즉 빈공간을 클릭하지 않았고
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
    scoreTodayVariation = scoreTodayVariation  + 100 + combo*10;
    
    score.textContent = scoreValue;
    scoreToday.textContent = scoreTodayValue + scoreTodayVariation;
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
    if(matchedNo === 10 ){
      character.classList.remove(`charater0${m}`);
      setTimeout(()=>{
        audioClear.play();
        
        m = Math.floor(Math.random()*10);
        console.log(m);
        //character.style.backgroundImage = `url('../img/character0${m}.png')`;
        //위의 코드. backgroundImgae url 가 깃허브에서 작동을 안하므로
        //classList.add 로 수정하여 바꿈
        character.classList.add(`charater0${m}`);
        clearBox.style.display = 'block';
        scoreProgressDisplay();
        // console.log(scoreValue);
        if (scoreValue > 100){
          playBtn.classList.add('playBtnClear'); //버튼 색깔 바뀌는 css추가
          playBtn.innerText = 'YOU DID IT!';
        }
        checkedE = '';
        checkedK = '';
        serialE = '';
        serialK = '';
        InsertData();
      },300)
    }
    // 선택된 영단어와 한글뜻이 각각 있고 서로 다르면
  } else if(checkedE && checkedK && serialE !== serialK){
    audioNo.play();
    scoreValue -= 50;
    scoreTodayVariation -= 50;
    combo = 0;
    score.textContent = scoreValue;
    scoreToday.textContent = scoreTodayValue + scoreTodayVariation;
    
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
