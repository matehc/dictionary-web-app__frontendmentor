const switchEl = document.querySelector('.switch__input');
const switchLabel = document.querySelector('.switch');

const theme = window.localStorage.getItem("theme");


if (theme === "dark") {
    document.body.classList.add("dark");
    switchLabel.classList.remove('switch--off');
    switchLabel.classList.add('switch--on');
    switchEl.checked = true;
} else {
    document.body.classList.remove("dark");
    switchLabel.classList.remove('switch--on');
    switchLabel.classList.add('switch--off');
    switchEl.checked = false;
}

switchLabel.addEventListener('click', ()=> {

    if(switchEl.checked === true) {
        document.body.classList.add("dark");
        switchLabel.classList.remove('switch--off');
        switchLabel.classList.add('switch--on');
        switchEl.checked = true;
        window.localStorage.setItem("theme", "dark"); 
    } 
    else {
        document.body.classList.remove("dark");
        switchLabel.classList.remove('switch--on');
        switchLabel.classList.add('switch--off');
        switchEl.checked = false;
        window.localStorage.setItem("theme", "light")
    }
})
