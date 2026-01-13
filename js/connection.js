import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js"
import { getUserName } from "./firebase/database.js"
import { auth } from "./firebase/firebase.js"

const registerbtn = document.getElementById('register')

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const username = await getUserName(auth.currentUser.uid)
        registerbtn.innerHTML = `👤 ${username}`
    } else {
        registerbtn.innerHTML = '👤 Ingresar'
    }
})