const select = document.querySelector('.select');
const selected = document.querySelector('.selected');
const arrow = document.querySelector('.arrow-icon')
const menu = document.querySelector('.menu');
const fontOptions = document.querySelectorAll('.menu > li');


let textFromSelectedFont;

console.log(fontOptions)

select.addEventListener('click', ()=>{
    menu.classList.toggle("show");
    arrow.classList.toggle('rotate');
})

fontOptions.forEach(font => {
   font.classList.remove('active');

   fontOptions.forEach(font => {
    font.addEventListener('click', ()=>{
        font.classList.add('active');
        menu.classList.toggle('show');
        textFromSelectedFont = font.textContent;
        selected.textContent = textFromSelectedFont;
    })
   })
})