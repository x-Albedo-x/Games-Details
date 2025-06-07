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
        console.error('Error cargando datos del juego:', error);
        showErrorState();
    }
}

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