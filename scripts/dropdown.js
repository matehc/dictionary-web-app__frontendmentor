const root = document.querySelector(':root');
const select = document.querySelector('.select');
const selected = document.querySelector('.selected');
const arrow = document.querySelector('.arrow-icon')
const menu = document.querySelector('.menu');
const dropdown = document.querySelector('.dropdown');
const fontOptions = document.querySelectorAll('.menu > li');
// const body = document.querySelector("body.body-font");

document.querySelector('.menu > li:nth-child(1)').classList.add("list-font__san-serif");
document.querySelector('.menu > li:nth-child(2)').classList.add("list-font__serif");
document.querySelector('.menu > li:nth-child(3)').classList.add("list-font__mono");



select.addEventListener('click', ()=>{
    menu.removeAttribute('id');
    menu.classList.toggle("show");
    arrow.classList.toggle('rotate');
})

fontOptions.forEach(fontOption => {
   fontOption.classList.remove('active');
    fontOption.addEventListener('click', ()=>{
        let selectedFont = fontOption.getAttribute("data-body-font");
        root.style.setProperty("--body-font-family",selectedFont);
        fontOption.classList.add('active');
        menu.classList.toggle('show');
        textFromSelectedFont = fontOption.textContent;
        selected.textContent = textFromSelectedFont;
        arrow.classList.toggle('rotate');

    })
})



document.addEventListener('click', (e)=> {
    if(e.target.closest('.dropdown')){
        menu.removeAttribute('id');
    }
    else{
        menu.classList.remove("show");
        menu.setAttribute('id', "hide");
        arrow.classList.remove('rotate');
    }
});
