import { onAuthStateChanged, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js"
import { getUser, updateUser, getUserList, deleteUserDoc } from "./firebase/database.js"
import { auth } from "./firebase/firebase.js"
import { toast } from "./firebase/showMessage.js"
import './firebase/logout.js'

const registerbtn = document.getElementById('register')
const mailDisplay = document.getElementById('mail-display')
const userDisplay = document.getElementById('user-display')

const emailChange = document.getElementById('emailForm')
const passChange = document.getElementById('passForm')
const userChange = document.getElementById('userForm')
const userDel = document.getElementById('eraseForm')
const erasebtn = document.getElementById('eraseAccept')

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = './sign.html'
    } else {
        const userid = await getUser(auth.currentUser.uid)
        registerbtn.innerHTML = `👤 ${userid.nombre}`
        mailDisplay.innerHTML = `${auth.currentUser.email}`
        userDisplay.innerHTML = `${userid.nombre}`

        //updateUser(auth.currentUser.uid, {gamelist: [{gid: '730', title: 'Counter-Strike 2'}]})
        loadList()
    }
})

// Editar Correo
emailChange.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const email = emailChange['emailInput'].value
    const pass = emailChange['emailConfirm'].value
    const credentials = EmailAuthProvider.credential(auth.currentUser.email, pass)

    reauthenticateWithCredential(auth.currentUser, credentials).then(() => {
        updateEmail(auth.currentUser, email).then(() => {
            mailDisplay.innerHTML = `${auth.currentUser.email}`
            emailChange['emailInput'].value = ''
            emailChange['emailConfirm'].value = ''
            toast('Correo Actualizado')
        }).catch((error) => {
            // Mensajes de Error para Email
            if (error.code == 'auth/email-already-in-use') {
                toast('Correo en Uso', 'error')
            } else if (error.code == 'auth/invalid-email') {
                toast('Correo Invalido', 'error')
            } else {
                toast('Algo salio mal...', 'error')
            }
        })
    }).catch((error) => {
        // Mensajes de Error para Confirmacion
        if (error.code == 'auth/invalid-credential') {
            toast('Contraseña Incorrecta', 'error')
        } else if (error.code == 'auth/wrong-password') {
            toast('Contraseña Incorrecta', 'error')
        }
    })
})

// Editar Contraseña
passChange.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const passOne = passChange['passOneInput'].value
    const passTwo = passChange['passTwoInput'].value
    const passConf = passChange['passConfirm'].value
    const credentials = EmailAuthProvider.credential(auth.currentUser.email, passConf)

    if (passOne != passTwo) {
        toast('La Contraseña Nueva no Coincide', 'error')
        return
    }

    reauthenticateWithCredential(auth.currentUser, credentials).then(() => {
        updatePassword(auth.currentUser, passOne).then(() => {
            passChange['passOneInput'].value = ''
            passChange['passTwoInput'].value = ''
            passChange['passConfirm'].value = ''
            toast('Contraseña Actualizada')
        }).catch((error) => {
            // Mensajes de Error para Contraseña
            if (error.code == 'auth/weak-password') {
                toast('Contraseña Demasiado Debil', 'error')
            } else {
                toast('Algo salio mal...', 'error')
            }
        })
    }).catch((error) => {
        // Mensajes de Error para Confirmacion
        if (error.code == 'auth/invalid-credential') {
            toast('Contraseña Actual Incorrecta', 'error')
        } else if (error.code == 'auth/wrong-password') {
            toast('Contraseña Actual Incorrecta', 'error')
        }
    })
})

// Editar Usuario
userChange.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const userInput = userChange['userInput'].value
    const pass = userChange['userConfirm'].value
    const credentials = EmailAuthProvider.credential(auth.currentUser.email, pass)

    reauthenticateWithCredential(auth.currentUser, credentials).then(() => {
        updateUser(auth.currentUser.uid, {nombre: userInput})
        registerbtn.innerHTML = `👤 ${userInput}`
        userDisplay.innerHTML = `${userInput}`
        userChange['userInput'].value = ''
        userChange['userConfirm'].value = ''
        toast('Nombre de Usuario Actualizado')
    }).catch((error) => {
        // Mensajes de Error para Confirmacion
        if (error.code == 'auth/invalid-credential') {
            toast('Contraseña Incorrecta', 'error')
        } else if (error.code == 'auth/wrong-password') {
            toast('Contraseña Incorrecta', 'error')
        }
    })
})

// Eliminar Usuario
userDel.addEventListener('submit', async (e) => {

    e.preventDefault()
    erasebtn.innerHTML = '<img src="../img/loading.gif" width="20">'
    
    const pass = userDel['eraseConfirm'].value
    const credentials = EmailAuthProvider.credential(auth.currentUser.email, pass)

    reauthenticateWithCredential(auth.currentUser, credentials).then(async () => {
        await deleteUserDoc(auth.currentUser.uid).then(async () => {
            await deleteUser(auth.currentUser).then(() => {
                window.location.href = '../../index.html'
            })
        })
    }).catch((error) => {
        erasebtn.innerHTML = 'Aceptar'
        // Mensajes de Error para Confirmacion
        if (error.code == 'auth/invalid-credential') {
            toast('Contraseña Incorrecta', 'error')
        } else if (error.code == 'auth/wrong-password') {
            toast('Contraseña Incorrecta', 'error')
        }
    })
})

// Cargar Lista de Juegos
const loadList = async () => {
    const gameArray = await getUserList(auth.currentUser.uid)
    const listElement = document.getElementById('game-list')
    listElement.innerHTML = ''
    
    gameArray.forEach((game, ind) => {
        const item = document.createElement('div')
        item.innerHTML =
        `
        <div class="item-id"><i>ID ${game.gid}</i></div>
        <div class="item-title">
            <span><b>${game.title}</b></span>
            <div class="item-title-buttons">
                <button data-id="${game.gid}" class="btn btn-primary btn-sm view">🔍</button>
                <button data-id="${ind}" class="btn btn-danger btn-sm remove">🗑️</button>
            </div>
        </div>
        `
        item.classList.add('game-list-item')
        listElement.appendChild(item)
    })

    document.querySelectorAll('.remove').forEach((btn) => {
        btn.addEventListener('click', async (e) => {

            const newArray = await getUserList(auth.currentUser.uid)
            const index = e.target.getAttribute('data-id')
            newArray.splice(index, 1)

            updateUser(auth.currentUser.uid, {gamelist: newArray})
            loadList()
        })
    })

    document.querySelectorAll('.view').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('data-id')
            window.location.href = `../pages/games_info.html?id=${encodeURIComponent(targetId)}`
        })
    })
}