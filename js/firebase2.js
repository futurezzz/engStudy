
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
  clearBox.style.display = 'none';
  console.log(thisMonth);
  randomArray(); //난수를 발생시켜 단어와 뜻을 섞음
  displayWords();
}

// ----------- SELECT DATA FUNCTION ---------------------------------//    
// async function SelectData(){
//   const dbref = ref(db);

//   await get(child(dbref, `${user}/` + chapter)).then((snapshot)=>{
//     if(snapshot.exists()){
//       scoreArray = snapshot.val().Score;
//       }
        
//         else {
//           alert("No data found")  
//         }
//       })
//       .catch((error)=>{
//         alert("unsuccessful, error" + error);
//       });
//       await displayUnits();
//     }



// ----------- SELECT DATA FUNCTION ---------------------------------// 
    //선택한 단원에 해당하는 각 unit점수들 불러오기 
async function SelectData(){
  const dbref = ref(db);
  await get(child(dbref, `${user}/` + chapter)).then((snapshot)=>{
    if(snapshot.exists()){
      scoreArray = snapshot.val().Score;
      scoreSpeakArray = snapshot.val().ScoreSpeak;
    }
        //firebase데이터에 아무것도 없을 경우
        //unit개수만큼 점수0을 넣은 scoreArray를 생성한다.
        else {
          //새로운 배열을 만들고 각 자리에 0을 채운다.
          scoreArray = new Array(unitLength).fill(0); 
          scoreSpeakArray = new Array(unitLength).fill(0); 
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
  scoreArray[unit-1] = scoreValue;
  dateScoreArray[new Date().getDate()-1] = scoreTodayValue;
  set(ref(db, `${user}/` + chapter), {
        Score : scoreArray,
        ScoreSpeak : scoreSpeakArray
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



    // quiz.js 에서 가져옴--------------------------------------------------------
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
    scoreTodayValue = scoreTodayValue + 100 + combo*10;
    score.textContent = scoreValue;
    scoreToday.textContent = scoreTodayValue;
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
    scoreTodayValue -= 50;
    combo = 0;
    score.textContent = scoreValue;
    scoreToday.textContent = scoreTodayValue;
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
