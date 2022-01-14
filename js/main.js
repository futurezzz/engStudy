const mainChapter = document.querySelector('.list');
const subUnitList = document.querySelector('.sub-unit-list');
let chapter;
let units = [];
let itemArray = [];
let unitLength = 0; //전체 unit의 개수

mainChapter.addEventListener('click', (e)=> {
  chapter = e.target.dataset.chapter;
  init();
  console.log(chapter);
})
subUnitList.addEventListener('click',(e)=>{
  let elem = e.target.classList;
  let isAvailable = elem.contains("unit"); //빈공간이 아닌 버튼을 눌렀으면 true
  if(isAvailable){
    elem.add('unit-on');
    const unitNo = e.target.dataset.unit;
    localStorage.setItem("unit",unitNo);
    localStorage.setItem("chapter",'ENG100A');
    if (typeof (window.open) == "function")
    { window.open("quiz.html"); 
    } else { window.location.href = "quiz.html";
    }
  }
})


//main

function init(){
  loadItems()
  .then(items => {
    displayItems(items);
    displayUnits();
  })
  .catch(console.log);
}


// functions
async function loadItems(){
  const response = await fetch('data/data.json');
  const json = await response.json();
  itemArray = json.items
    .filter(item => item.chapter == chapter);
  return itemArray;
}

//groupBy 함수를 만들어 unit별로 group후 unit개수 알아내기
// function groupBy(list, keyGetter) {
//   const map = new Map();
//   list.forEach((item) => {
//     const key = keyGetter(item);
//     const collection = map.get(key);
//     if (!collection) {
//         map.set(key, [item]);
//     } else {
//         collection.push(item);
//     }
//   });
//   return map;
// }
function groupBy(list) {
  let collectionArray = [];
  list.forEach((item) => {
    const collection = item.unit;
    if (!collectionArray.includes(collection)){
        unitLength++;
        collectionArray.push(collection);
    } 
  });
  return unitLength;
}


function displayItems(items){
  units = items.map(item=>item);
  const grouped = groupBy(units);
  console.log(grouped);
}

function displayUnits(){
  subUnitList.innerHTML = ''; //unit메뉴들을 초기화
  for(let i=1; i<unitLength+1; i++ ){
    const li = document.createElement('li');
    li.textContent = `Unit ${i}`;
    li.classList.add('unit');
    li.dataset.unit = i; //나중에 li선택시 어떤 unit을 클릭했는지 데이터 전송을 위해 필요
    subUnitList.append(li);
  }
}