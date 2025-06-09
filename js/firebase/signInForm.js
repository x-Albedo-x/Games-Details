import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js"
import { auth } from "./firebase.js"
import { toast } from "./showMessage.js"

const signin = document.getElementById('signInForm')
const signinbtn = document.getElementById('form-button-log')

signin.addEventListener('submit', async (e) => {

    e.preventDefault()
    signinbtn.innerHTML = '<img src="../img/loading.gif" width="20">'

    const email = signin['emailIn'].value
    const pass = signin['passwordIn'].value

    try {
        await signInWithEmailAndPassword(auth, email, pass)
        window.location.href = '../../index.html'

    } catch (error) {
        signinbtn.innerHTML = 'Iniciar Sesion'
        console.log(error.code)
        // Show Error Messages
        if (error.code == 'auth/invalid-credential') {
            toast('Usuario/Contraseña Incorrecta', 'error')
        } else if (error.code == 'auth/user-not-found') {
            toast('Usuario Inexistente', 'error')
        } else {
            toast('Algo salio mal...', 'error')
        }
    }
    
})