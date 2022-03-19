
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

subUnitList.addEventListener('click',(e)=>{
  elem = e.target;
  url = "quiz.html";
  console.log(elem)
  SelectData();
  SelectTodayData();//방금 업데이트 된 점수들을 반영하여 transferData()를 실행한다.(자식폼에게 업데이트 점수 전달)
})
subSpeakList.addEventListener('click',(e)=>{
  elem = e.target;
  url = "quizSpeak.html";
  console.log(elem)
  SelectData();
  SelectTodayData();//방금 업데이트 된 점수들을 반영하여 transferData()를 실행한다.(자식폼에게 업데이트 점수 전달)
})

signIn.addEventListener('click',()=>{
  SelectCalendarData();
})

changeUser.addEventListener('click', ()=>{
  SelectCalendarData();
})



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
      await displayUnits();
    }

// export {InsertData}; 
// export {SelectData}; 

    // ----------- INSERT DATA FUNTION ---------------------------------//    
function InsertData(){
  console.log("next level");
  // set(ref(db, `${user}/` + Chapter), {
  //       Score : [33,0,2,5,0,0,0,0,0,0,0,0,0]
  //     })
  //     .then(() => {
  //       alert("data stored successfully");
  //     })
  //     .catch((error)=>{
  //       alert("unsuccessful, error" + error);
  //     });
    }
