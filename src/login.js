const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

/*for the registration button*/
registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
})

/*for the login button*/
loginLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
})

/*for the login form to pop-up the website*/
btnPopup.addEventListener('click', ()=> {
    wrapper.classList.add('active-popup');
})

/*for the button to close the log-in/registration pop-up*/
iconClose.addEventListener('click', ()=> { 
    wrapper.classList.remove('active-popup');
})