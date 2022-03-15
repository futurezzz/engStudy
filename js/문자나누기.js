const text =  document.querySelector('#text');
const button =  document.querySelector('#button');
const clear =  document.querySelector('#clear');
const result =  document.querySelector('.result');

button.addEventListener('click',()=>{
  let splited = text.value.split(/[.?]/); //.이나 ?가 있는 곳에서 문자나누기. /s는 스페이스
  console.log(splited);
  for (let i=0; i<splited.length; i++){
    let elem = document.createElement('li')
    elem.textContent = `${splited[i]}`
    result.append(elem);
  }
})

clear.addEventListener('click',()=>{
  result.textContent = '';
})