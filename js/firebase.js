
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

  import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

    const db = getDatabase();


// REFERENCE //
userBox.addEventListener('click', (e)=>{
  user = e.target.dataset.user;
  if(user){
    SelectCalendarData();
  }
});

mainChapter.addEventListener('click',(e)=>{
  if(user && chapter){
    SelectData();
  }
})

grammerChapter.addEventListener('click',(e)=>{
  if(user && chapter){
    SelectData();
  }
})

// historyChapter.addEventListener('click',(e)=>{
//   if(user && chapter){
//     SelectData();
//   }
// })

grammerSubUnitList.addEventListener('click',(e)=>{
  elem = e.target;
  chapterTitle = collectionArray[elem.dataset.unit-1];
  console.log(chapterTitle);
  quizType = 'grammer';
  SelectScore(parseInt(elem.dataset.unit)-1); //scoreValue를 업데이트 해서 다시 불러오기 위함
  setTimeout(() => {
    scoreValue = scoreValue ?? 0; //scoreValue가 null or undefined 이면 0을 사용하라
    elem.innerHTML = `${chapter} ${elem.dataset.unit} <br/> ${scoreValue}`;
  }, 500);
  SelectTodayData();//방금 업데이트 된 점수들을 반영하여 transferData()를 실행한다.(자식폼에게 업데이트 점수 전달)
})




subUnitList.addEventListener('click',(e)=>{
  elem = e.target;

  SelectScore(parseInt(elem.dataset.unit)-1); //scoreValue를 업데이트 해서 다시 불러오기 위함
  setTimeout(() => {
    scoreValue = scoreValue ?? 0; //scoreValue가 null or undefined 이면 0을 사용하라
    elem.innerHTML = `${chapter} ${elem.dataset.unit} <br/> ${scoreValue}`;
    quizType = 'speaking';
    // if (scoreValue >= 50000){
    //   quizType = "speaking"
    // } else if (scoreValue >= 45000){
    //   quizType = "matching";
    // } else if (scoreValue >= 30000){
    //   quizType = "speaking"
    // } else if (scoreValue >= 25000){
    //   quizType = "matching";
    // } else if (scoreValue >= 6000){
    //   quizType = "speaking"
    // } else {
    //   quizType = "matching"
    // }

    if (chapter == '한국사'){
      quizType = 'history'
    }
    console.log(chapter);
    // quizType = scoreValue <=60000 ? "matching" : "speaking";
    // url = (quizType === "matching") ? "quiz.html" : "quizSpeak.html"
    // console.log(elem, quizType);
    SelectTodayData();//방금 업데이트 된 점수들을 반영하여 transferData()를 실행한다.(자식폼에게 업데이트 점수 전달)
  }, 300);
  

})

signIn.addEventListener('click',()=>{
  calendar.style.visibility = 'visible';
  SelectCalendarData();
})

changeUser.addEventListener('click', ()=>{
  calendar.style.visibility = 'visible';
  SelectCalendarData();
})


    
//------------- 캘린더에서 좌,우 화살표 클릭 시 월별이동 이벤트
calendarLeftArrow.addEventListener('click',(e)=>{
  doShiftMonth(-1);
});

calendarRighttArrow.addEventListener('click',(e)=>{
  doShiftMonth(1);
})


//------------- 캘린더에서 user이름 클릭 시 월별이동 이벤트
signIn.addEventListener('click',(e)=>{
  today = new Date();
  thisMonth = `${today.getFullYear()}/${today.getMonth()+1}`;
  getDayOfFirst();
  SelectCalendarData();
})


function doShiftMonth(shiftMonth){
  // today = new Date(today.setMonth(today.getMonth()-1));
  today = new Date(today.setMonth(today.getMonth()+shiftMonth));
  thisMonth = `${today.getFullYear()}/${today.getMonth()+1}`;
  getDayOfFirst();
  SearchCalendarData();

}


// ----------- SELECT PROGRESS FUNCTION ---------------------------------//    
async function SelectCalendarData(){
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
      })
      .catch((error)=>{
        alert("unsuccessful, error" + error);
      });
      await displayCalendar();
    }


    
    async function SearchCalendarData(){
      const dbref = ref(db);
      await get(child(dbref, `${user}/` + 'calendar'+ `/${thisMonth}`)).then((snapshot)=>{
        if(snapshot.exists()){
          dateScoreArray = snapshot.val().DateScore;
        }
        //firebase데이터에 아무것도 없을 경우
        else {
          dateScoreArray = [];
        }
      })
      .catch((error)=>{
        alert("unsuccessful, error" + error);
      });
      await displayCalendar();
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
          })
          .catch((error)=>{
            alert("unsuccessful, error" + error);
          });
          await transferData();
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
      //displayUnits은 해당unit점수표시와 진행정도 표시
      displayUnits();
    }


    // --특정 유닛의 score만 가져오기--------------------------
async function SelectScore(unit){
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
      scoreValue = scoreArray[unit];
    }


