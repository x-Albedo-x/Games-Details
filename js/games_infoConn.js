import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js"
import { getUserName, updateUser, getUserList } from "./firebase/database.js"
import { auth } from "./firebase/firebase.js"

const registerbtn = document.getElementById('register')
const addBtn = document.getElementById('saveGame')

const params = new URLSearchParams(window.location.search)
const gameID = params.get('id')

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        addBtn.setAttribute('disabled', 'true')
        registerbtn.innerHTML = '👤 Ingresar'
    } else {
        const username = await getUserName(auth.currentUser.uid)
        registerbtn.innerHTML = `👤 ${username}`
        const list = await getUserList(auth.currentUser.uid)

        const val = list.findIndex((el) => {
            return el.gid == gameID
        })

        if (val != -1) {
            addBtn.classList.add('btn-danger')
            addBtn.classList.remove('btn-primary')
            addBtn.innerHTML = 'Siguiendo'
        }
    }
})

// Agregar Juego a la Lista
addBtn.addEventListener('click', async() => {
    
    if (addBtn.innerHTML == 'Seguir') {
        const response = await fetch(`https://games-details.p.rapidapi.com/gameinfo/single_game/${gameID}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '1e5a12f004msh46229e7c88c4743p144147jsnb1b34afac718',
                'x-rapidapi-host': 'games-details.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        const gameTitle = result.data.name
        const newList = await getUserList(auth.currentUser.uid)

        newList.push({gid: gameID, title: gameTitle})
        updateUser(auth.currentUser.uid, {gamelist: newList})

        addBtn.classList.remove('btn-primary')
        addBtn.classList.add('btn-danger')
        addBtn.innerHTML = 'Siguiendo'

    } else {

        const newArray = await getUserList(auth.currentUser.uid)
        const index = newArray.findIndex((el) => {
            return el.gid == gameID
        })

        newArray.splice(index, 1)
        updateUser(auth.currentUser.uid, {gamelist: newArray})

        addBtn.classList.remove('btn-danger')
        addBtn.classList.add('btn-primary')
        addBtn.innerHTML = 'Seguir'
    }
})