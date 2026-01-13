import './firebase/signUpForm.js'
import './firebase/signInForm.js'

const logbtn = document.getElementById('log-btn')
const signbtn = document.getElementById('sign-btn')
const logcont = document.getElementById('logInCont')
const signcont = document.getElementById('signUpCont')

logbtn.addEventListener('click', () => {
    logcont.classList.add('hidden')
    signcont.classList.remove('hidden')
})

signbtn.addEventListener('click', () => {
    signcont.classList.add('hidden')
    logcont.classList.remove('hidden')
})