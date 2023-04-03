let switchEl = document.querySelector('.switch__input');
let switchLabel = document.querySelector('.switch');


switchLabel.addEventListener('click', ()=> {
    console.log('switch clicked')

    if(switchEl.checked === true) {
        switchLabel.classList.remove('switch--on');
        switchLabel.classList.add('switch--off');
        switchEl.checked = false;
    } 
    else {
        switchLabel.classList.remove('switch--off');
        switchLabel.classList.add('switch--on');
        switchEl.checked = true;
    }
})
