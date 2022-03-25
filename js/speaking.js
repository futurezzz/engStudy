window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;


//   const myRe = /d(b+)d/g;
//   const myArray = myRe.exec('cdbbdbsbz');
// console.log(myArray);;
// console.log(myArray.length)

// const test = "What's wrong?"
// const myRe = /\b\S\w*\b/g;
// console.table(test.match(myRe));

// Using Regex boundaries to fix buggy string.
buggyMultiline = `tey, ihe light-greon apple
tangs on ihe greon traa`;
//특수문자제거
var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
//공백 모두 없애기
var reg2 = /\s/g; 

textA = " How's it going?"
// textA = textA.match(/\S\w*/gim);
textB = textA.toLowerCase().replace(regExp, "");
textC = textA.replace(/^\s*/, "");
console.log(textB);
console.log(textC);

// 1) Use ^ to fix the matching at the begining of the string, and right after newline.
// buggyMultiline = buggyMultiline.replace(/^t/gim,'h');
// console.log(1, buggyMultiline); // fix 'tey', 'tangs' => 'hey', 'hangs'. Avoid 'traa'.

// // 2) Use $ to fix matching at the end of the text.
// buggyMultiline = buggyMultiline.replace(/aa$/gim,'ee.');
// console.log(2, buggyMultiline); // fix  'traa' => 'tree'.

// // 3) Use \b to match characters right on border between a word and a space.
// buggyMultiline = buggyMultiline.replace(/\bi/gim,'t');
// console.log(3, buggyMultiline); // fix  'ihe' but does not touch 'light'.

// // 4) Use \B to match characters inside borders of an entity.
// fixedMultiline = buggyMultiline.replace(/\Bo/gim,'e');
// console.log(4, fixedMultiline); // fix  'greon' but does not touch 'on'.


// 인스턴스 생성
const recognition = new SpeechRecognition();
let toggle = true;
// true면 음절을 연속적으로 인식하나 false면 한 음절만 기록함
recognition.interimResults = true;
// 값이 없으면 HTML의 <html lang="en">을 참고합니다. ko-KR, en-US
recognition.lang = "en-US";
// true means continuous, and false means not continuous (single result each time.)
// true면 음성 인식이 안 끝나고 계속 됩니다.
recognition.continuous = true;
// 숫자가 작을수록 발음대로 적고, 크면 문장의 적합도에 따라 알맞은 단어로 대체합니다.
// maxAlternatives가 크면 이상한 단어도 문장에 적합하게 알아서 수정합니다.
recognition.maxAlternatives = 10000;

let p = document.createElement("p");
p.classList.add("para");

let words = document.querySelector(".words");
words.appendChild(p);

let mic = document.querySelector("#circlein")
let speechToText = "";
recognition.addEventListener("result", e => {
  let interimTranscript = '';
  for (let i = e.resultIndex, len = e.results.length; i < len; i++) {
    let transcript = e.results[i][0].transcript;
    console.log(transcript)
    if (e.results[i].isFinal) {
      speechToText += transcript;
    } else {
      interimTranscript += transcript;
    }
  }


  recognition.addEventListener('soundend', () => {
    mic.style.backgroundColor = null;
  });


  document.querySelector(".para").innerHTML = speechToText + interimTranscript
})


mic.addEventListener("click", () => {
  if (toggle) {
    recognition.start();
    toggle = false;
  }
  else {
    recognition.stop();
    // mic.style.backgroundColor = null;
    toggle = true;
  }

  mic.style.backgroundColor = "#6BD6E1"
})


// 음성인식이 끝나면 자동으로 재시작합니다.
// recognition.addEventListener("end", recognition.start);

// 음성 인식 시작
// recognition.start();

