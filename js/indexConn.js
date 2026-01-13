import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js"
import { getUserName, getUserList } from "./firebase/database.js"
import { auth } from "./firebase/firebase.js"

const registerbtn = document.getElementById('register')
const featuredNews = document.getElementById('featured-news')

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const username = await getUserName(auth.currentUser.uid)
        const lista = await getUserList(auth.currentUser.uid)
        registerbtn.innerHTML = `👤 ${username}`

        if (lista.length > 0) {

            const ind = Math.floor(Math.random() * (lista.length));
            console.log(ind)
            const gameObj = lista[ind]

            const response = await fetch(`https://games-details.p.rapidapi.com/news/all/${gameObj.gid}?limit=10&offset=0`, {
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
            const news = result.data.news || []
        
            if(news.length === 0) {
                featuredNews.innerHTML = '<b>No hay noticias disponibles.</b>'
            } else {
                const item = document.createElement('div')
                item.className = 'news-item'
                item.innerHTML = `
                    <div class="news-date">${news[0].date}</div>
                    <h3>${news[0].news_title}</h3>
                    <p>${news[0].content}</p>
                    <div style="margin-top: 1rem; color: #f9e2af; font-size:0.95rem;">👍 ${news[0].like}</div>
                `

                featuredNews.append(item)
            }
        } else {
            featuredNews.innerHTML = '<b>¡Guarda juegos en tu perfil para recibir sus ultimas noticias!</b>'
        }

    } else {
        registerbtn.innerHTML = '👤 Ingresar'
        featuredNews.innerHTML = '<b>Inicia sesion para obtener noticias personalizadas.</b>'
    }
})

