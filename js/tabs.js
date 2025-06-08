const tabControl = () => {
    const tabBtns = document.querySelectorAll('.tab-btn')
    const tabContents = document.querySelectorAll('.tab-content')
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'))
            btn.classList.add('active')
            tabContents.forEach(tc => tc.style.display = 'none')
            document.getElementById('tab-' + btn.dataset.tab).style.display = 'block'
        
            if(btn.dataset.tab == 'news') {
                loadNews()
            }
            else if(btn.dataset.tab === 'guides') {
                loadGuides()
            }
        })
    })
}

// NOTICIAS
const loadNews = async () => {
    try {
        // const url = 'https://games-details.p.rapidapi.com/news/announcements/730?limit=10&offset=0';
        // const options = {
        //     method: 'GET',
        //     headers: {
        //         'x-rapidapi-key': 'c2e0927e61msh8f3f2f17e67df13p19e1e8jsn4615bf544d26',
        //         'x-rapidapi-host': 'games-details.p.rapidapi.com'
        //     }
        // }
        // const response = await fetch(url, options)

        const response = await fetch('../db/news.json')

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);

        const newList = document.getElementById('newsList')
        newList.innerHTML = ''

        const news = result.data.news || []
        
        if(news.length === 0) {
            newList.innerHTML = '<div class="content-placeholder">No hay noticias disponibles.</div>'
            return
        }

        news.forEach(news => {
            const item = document.createElement('div')
            item.className = 'news-item'
            item.innerHTML = `
                <div class="news-date">${news.date}</div>
                <h3>${news.news_title}</h3>
                <p>${news.content}</p>
                <div style="margin-top: 1rem; color: #f9e2af; font-size:0.95rem;">👍 ${news.like}</div>
            `

            newList.append(item)
        })
    } catch (error) {
        console.error('Error cargando datos del juego:', error)
        showErrorState()
    }
}

// GUÍAS
let guideLastFilter = 'recent'
let guideCurrentPage = 1
let guideTotalPages = 1

const loadGuides = async (filter = 'recent', page = 1) => {
    guideLastFilter = filter
    guideCurrentPage = page

    try {
        let response, result, guides = []

        if(filter === 'recent') {
            // const url = 'https://games-details.p.rapidapi.com/guides/mostrecent/730?language=english&limit=10&offset=0'
            // const options = {
            //     method: 'GET',
            //     headers: {
            //         'x-rapidapi-key': 'c2e0927e61msh8f3f2f17e67df13p19e1e8jsn4615bf544d26',
            //         'x-rapidapi-host': 'games-details.p.rapidapi.com'
            //     }
            // }
            // response = await fetch(url, options)

            response = await fetch('../db/guide_recent.json')

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            result = await response.json()
            console.log(result)
        }
        else if(filter === 'top') {

        }
        else if(filter === 'trending') {

        }

        const guideList = document.getElementById('guideList')
        guideList.innerHTML = ''

        guides = result.data.guides || []

        if(guides.length === 0) {
            guideList.innerHTML = '<div class="content-placeholder">No hay guías disponibles.</div>';
            return;
        }

        guideTotalPages = Math.ceil(guides.length / 12)
        guideCurrentPage = Math.max(1, Math.min(page, guideTotalPages))

        let start = (guideCurrentPage - 1) * 12
        let end = start + 12
        let pageGuides = guides.slice(start, end)

        pageGuides.forEach(guide => {
            const item = document.createElement('div')
            item.className = 'guide-item'
            item.innerHTML = `
                <div class="guide-img">
                    <img src="${guide.thumnail}" alt="Miniatura de la guía">
                </div>
                <div class="guide-info">
                    <h3 class="guide-title">${guide.title}</h3>
                    <p class="guide-content">${guide.content.substring(0, 120)}...</p>
                </div>
            `

            guideList.appendChild(item)
        })

        // Actualizar paginación
        const guidePageInfo = document.getElementById('guidePageInfo')
        const prevBtn = document.getElementById('guidePrev')
        const nextBtn = document.getElementById('guideNext')
        const pagination = document.getElementById('guidePagination')

        if (guidePageInfo && prevBtn && nextBtn && pagination) {
            guidePageInfo.textContent = `Página ${guideCurrentPage} de ${guideTotalPages}`
            prevBtn.disabled = guideCurrentPage === 1
            nextBtn.disabled = guideCurrentPage === guideTotalPages
            pagination.style.display = guideTotalPages > 1 ? 'flex' : 'none'
        }
    } catch (error) {
        console.error('Error cargando datos del juego:', error)
        showErrorState()
    }
}

//Cambiar filtro
document.getElementById('guideSort').addEventListener('change', () => {
    loadGuides(this.value, 1)
})

// Eventos de paginación
document.getElementById('guidePrev').addEventListener('click', () => {
    if (guideCurrentPage > 1) {
        loadGuides(guideLastFilter, guideCurrentPage - 1);
    }
})

document.getElementById('guideNext').addEventListener('click', () => {
    if (guideCurrentPage < guideTotalPages) {
        loadGuides(guideLastFilter, guideCurrentPage + 1);
    }
})

// ERROR DE CARGA
const showErrorState = () => {
    const container = document.getElementById('game-info');
    container.innerHTML = `
        <div class="container" style="display: block; text-align: center; padding: 4rem 2rem;">
            <div class="section">
                <h2 style="color: #ff6b6b; margin-bottom: 1rem;">⚠️ Error al cargar el juego</h2>
                <p style="color: rgba(255,255,255,0.8); margin-bottom: 2rem;">
                    No se pudo cargar la información del juego. Por favor, verifica que el ID sea correcto o intenta nuevamente más tarde.
                </p>
                <button onclick="window.location.reload()" class="nav-btn" style="background: linear-gradient(45deg, #66d9ef, #a6e3a1);">
                    🔄 Recargar página
                </button>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    tabControl()
})