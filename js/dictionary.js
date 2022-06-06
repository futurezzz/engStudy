const title = document.querySelector('.title')
const userImg = document.querySelector('.user-img');
const searchText = document.querySelector('.search');
const searchIcon = document.querySelector('.search-icon');
const searchedSent = document.querySelector('.searchedSentence');
const allBtn = document.querySelector('.allBtn');
const closeBtn = document.querySelector('.close');
const wordsList = document.querySelector('.words-list');
const text = document.querySelector('.text');
const meaning = document.querySelector('.meaning');

let chapter;
let wordsArray = []; //해당 unit에 속하는 모든 문제들 담기
let searchArray = []; //해당 unit에 속하는 모든 문제들 담기


loadLocalStorage();
loadItems()
.then(items => {
  displayWords(items)
  console.log(wordsArray.length);
})
.catch(console.log);

async function loadItems(){
  const response = await fetch(`data/${chapter}.json`);
  const json = await response.json();
  wordsArray = json.items
    // .filter(item => item.unit == unit);
  return wordsArray;
}

wordsList.addEventListener('click',(e)=>{
  let searchedIndex = wordsArray.findIndex(item=>
      item.text == e.target.textContent);
        console.log(searchedIndex)
  let searchedSentence = wordsArray[searchedIndex].sentence;
        console.log(searchedSentence);
  searchedSent.textContent =  searchedSentence;
  })

searchIcon.addEventListener('click',()=>{
  searchArray = wordsArray.filter(item => item.text.includes(searchText.value) || item.meaning.includes(searchText.value) );
  displayWords(searchArray);
})

allBtn.addEventListener('click',()=>{
  searchText.value = '';
  displayWords(wordsArray);
})

closeBtn.addEventListener('click',()=>{
  window.close();
})

// --------------FUNCTION ----------------------------
// function displayItems(items){
//   word = items.map(item=>item);
// }

function displayWords(items){
  wordsList.innerHTML = '';
  for(let i=0; i<items.length; i++){
      const li = document.createElement('li');
      const li1 = document.createElement('li');
      const li2 = document.createElement('li');
      const li3 = document.createElement('li');
      const li4 = document.createElement('li');
      const li5 = document.createElement('li');
      // ``백틱 안에 공백넣는 것. \u00a0
      li3.textContent = items[i].unit;
      li3.classList.add('word');
      li3.classList.add('unit-num');
      wordsList.append(li3);

      li.textContent = `${i+1}`
      li.classList.add('word');
      li.classList.add('num');
      wordsList.append(li);

      li1.textContent = items[i].text; //json data에 담겨있는 단어글자를 li에 표시
      li1.classList.add('word');
      li1.classList.add('text');
      wordsList.append(li1);
      li2.textContent = items[i].meaning; //json data에 담겨있는 단어글자를 li에 표시
      li2.classList.add('word');
      li2.classList.add('meaning');
      wordsList.append(li2);

  }
}


function loadLocalStorage(){
  if(localStorage.getItem('unit')){
    user = localStorage.getItem('user');
    userImg.classList.add(`thumb${user}`);
    unit = localStorage.getItem('unit');
    chapter = localStorage.getItem('chapter');
    title.textContent = chapter;
    // unitText.textContent = `unit ${unit}`;
    // ``백틱 안에 공백. 스페이스. 한칸 넣는 것. \u00a0
    searchText.textContent = `\u00a0`;
    
  }
}