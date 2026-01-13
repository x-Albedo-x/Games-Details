import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js"
import { addUser } from "./database.js"
import { auth } from "./firebase.js"
import { toast } from "./showMessage.js"

const signup = document.getElementById('signUpForm')
const signupbtn = document.getElementById('form-button-sign')

signup.addEventListener('submit', async (e) => {

    e.preventDefault()
    signupbtn.innerHTML = '<img src="../img/loading.gif" width="20">'

    const username = signup['userUp'].value
    const email = signup['emailUp'].value
    const pass = signup['passwordUp'].value

    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, pass)
        await addUser(username, userCredentials.user.uid)
        window.location.href = '../../index.html'

    } catch (error) {
        signupbtn.innerHTML = 'Registrarse'

        // Show Error Messages
        if (error.code == 'auth/email-already-in-use') {
            toast('Correo en Uso', 'error')
        } else if (error.code == 'auth/invalid-email') {
            toast('Correo Invalido', 'error')
        } else if (error.code == 'auth/weak-password') {
            toast('Contraseña Demasiado Debil', 'error')
        } else {
            toast('Algo salio mal...', 'error')
        }
    }
})