// CONTROL DE TABS
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
            else if(btn.dataset.tab === 'reviews') {
                loadReviews()
            }
            else if(btn.dataset.tab === 'artwork') {
                loadArtwork()
            }
            else if(btn.dataset.tab === 'streams') {
                loadStreams()
            }
        })
    })
}

// ID DEL JUEGO
const params = new URLSearchParams(window.location.search)
let gameID = params.get('id')

// VARIABLE OPTIONS
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': 'c2e0927e61msh8f3f2f17e67df13p19e1e8jsn4615bf544d26',
        'x-rapidapi-host': 'games-details.p.rapidapi.com'
    }
}

// NOTICIAS
const loadNews = async (type='all') => {
    try {
        let response
        if(type === 'all') {
            // const url = `https://games-details.p.rapidapi.com/news/all/${gameID}?limit=10&offset=0`
            // const response = await fetch(url, options)
            response = await fetch('../db/news_all.json')
        } else {
            // const url = `https://games-details.p.rapidapi.com/news/announcements/${gameID}?limit=10&offset=0`
            // const response = await fetch(url, options)
            response = await fetch('../db/news_official.json')
        }
        
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

// Tabs de noticias
const newsControl =  () => {
    const newsBtns = document.querySelectorAll('.news-type-btn')
    newsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            newsBtns.forEach(b => b.classList.remove('active'))
            btn.classList.add('active')
            loadNews(btn.dataset.type)
        })
    })

    loadNews('all')
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
            // const url = `https://games-details.p.rapidapi.com/guides/mostrecent/${gameID}?language=english&limit=30&offset=0`
            // response = await fetch(url, options)

            response = await fetch('../db/guide_recent.json')
        }
        else if(filter === 'top') {
            // const url = `https://games-details.p.rapidapi.com/guides/toprated/${gameID}?language=english&limit=30&offset=0`
            // response = await fetch(url, options)
            
            response = await fetch('../db/guide_top.json')
        }
        else if(filter === 'trending') {
            // const url = `https://games-details.p.rapidapi.com/guides/trend/${gameID}?limit=30&offset=0&language=english`
            // response = await fetch(url, options)
            response = await fetch('../db/guide_trending.json')
        }

        if(!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
        }

        result = await response.json()
        console.log(result)
        guides = result.data.guides || []

        const guideList = document.getElementById('guideList')
        guideList.innerHTML = ''

        if(guides.length === 0) {
            guideList.innerHTML = '<div class="content-placeholder">No hay guías disponibles.</div>'
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
        
        guidePageInfo.textContent = `Página ${guideCurrentPage} de ${guideTotalPages}`
        prevBtn.disabled = guideCurrentPage === 1
        nextBtn.disabled = guideCurrentPage === guideTotalPages
        pagination.style.display = guideTotalPages > 1 ? 'flex' : 'none'
    } catch (error) {
        console.error('Error cargando datos del juego:', error)
        showErrorState()
    }
}

// Cambiar filtro
document.getElementById('guideSort').addEventListener('change', () => {
    const filter = document.getElementById('guideSort').value
    guideCurrentPage = 1 // Reiniciar a la primera página al cambiar el filtro
    loadGuides(filter, guideCurrentPage)
})

// Eventos de paginación
document.getElementById('guidePrev').addEventListener('click', () => {
    if (guideCurrentPage > 1) {
        loadGuides(guideLastFilter, guideCurrentPage - 1)
    }
})

document.getElementById('guideNext').addEventListener('click', () => {
    if (guideCurrentPage < guideTotalPages) {
        loadGuides(guideLastFilter, guideCurrentPage + 1)
    }
})

// RESEÑAS
const loadReviews = async (filter = "recent") => {
    try {
        let response, result, reviews = []

        if(filter === 'recent') {
            // const url = `https://games-details.p.rapidapi.com/reviews/mostrecent/${gameID}?limit=30&offset=0`
            // response = await fetch(url, options)
            response = await fetch('../db/reviews_recent.json')
        }
        else if(filter === 'top') {
            // const url = `https://games-details.p.rapidapi.com/reviews/toprated/${gameID}?limit=30&offset=0`
            // }
            // response = await fetch(url, options)
            response = await fetch('../db/reviews_top.json')
        }
        else if(filter === 'day') {
            // const url = `https://games-details.p.rapidapi.com/reviews/trendday/${gameID}?limit=30&offset=0`
            // response = await fetch(url, options)
            response = await fetch('../db/reviews_day.json')
        }
        else if(filter === 'week') {
            // const url = `https://games-details.p.rapidapi.com/reviews/trendweek/${gameID}/?limit=30&offset=0`
            // response = await fetch(url, options)
            response = await fetch('../db/reviews_week.json')
        }
        else if(filter === 'month') {
            // const url = `https://games-details.p.rapidapi.com/reviews/trendmonth/${gameID}/?limit=30&offset=0`
            // response = await fetch(url, options)
            response = await fetch('../db/reviews_month.json')
        }
        else if(filter === 'year') {
            // const url = `https://games-details.p.rapidapi.com/reviews/trendyear/${gameID}/?limit=30&offset=0`
            // response = await fetch(url, options)
            response = await fetch('../db/reviews_year.json')
        }
        else if(filter === 'funny') {
            // const url = `https://games-details.p.rapidapi.com/reviews/funny/${gameID}/?limit=30&offset=0`
            // response = await fetch(url, options)
            response = await fetch('../db/reviews_funny.json')
        }

        if(!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
        }

        result = await response.json()
        console.log(result)
        if(filter === 'recent') {
            reviews = result.data.reviews || []
        } else reviews = result || []

        const reviewsContainer = document.getElementById('reviewsContainer')
        reviewsContainer.innerHTML = ''

        if(reviews.length === 0) {
            reviewsContainer.innerHTML = '<div class="content-placeholder">No hay reseñas disponibles.</div>'
        }

        reviews.forEach(review => {
            const item = document.createElement('div')
            item.className = 'review-item'
            item.innerHTML = `
                <div class="review-header">
                    <div style="display:flex;align-items:center;gap:0.75rem;">
                        <img src="${review.user_profile.split('🔍')[0]}" alt="Avatar" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">
                        <span style="color:#a6e3a1;font-weight:600;">${review.user_name}</span>
                    </div>
                    <span class="review-date">${review.date || ''}</span>
                </div>
                <div style="margin-bottom:0.5rem;">
                    <span class="review-rating" style="color:${review.title === 'Recommended' ? '#a6e3a1' : '#f38ba8'};">
                        ${review.title === 'Recommended' ? '👍 Recomendado' : '👎 No recomendado'}
                    </span>
                </div>
                <p>${review.content || ''}</p>
            `

            reviewsContainer.appendChild(item)
        })
    } catch(error) {
        console.error('Error cargando datos del juego:', error)
        showErrorState()
    }
}

document.getElementById('reviewSort').addEventListener('change', () => {
    const filter = document.getElementById('reviewSort').value
    loadReviews(filter)
})

// ARTWORK
let artworkCurrentPage = 1
let artworkTotalPages = 1

const loadArtwork = async (page = 1) => {
    artworkCurrentPage = page
    
    try {
        let result, art = []

        // const url = `https://games-details.p.rapidapi.com/media/artworks/${gameID}?limit=30&offset=0`
        // const response = fetch(url, options)
        const response = await fetch('../db/artworks.json') 
        
        if(!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
        }

        result = await response.json()
        art = result.data.artworks

        const artworkGallery = document.getElementById('artworkGallery')
        artworkGallery.innerHTML = ''

        if(art.length === 0) {
            artworkGallery.innerHTML = '<div class="content-placeholder">No hay artworks disponibles.</div>'
        }
        console.log(art.length)
        console.log(Math.ceil(art.length / 24))
        artworkTotalPages = Math.ceil(art.length / 24)
        artworkCurrentPage = Math.max(1, Math.min(page, artworkTotalPages))
        
        const start = (artworkCurrentPage - 1) * 24
        const end = start + 24
        const artGuides = art.slice(start, end)

        artGuides.forEach(art => {
            const item = document.createElement('div')
            item.innerHTML = `
                <img class="artwork-img" src="${art}">
            `

            item.querySelector('.artwork-img').addEventListener('click', () => {
                openArtworkModal(art)
            })

            artworkGallery.appendChild(item)
        })

        // Actualizar paginación
        const artworkPageInfo = document.getElementById('artworkPageInfo')
        const prevBtn = document.getElementById('artworkPrev')
        const nextBtn = document.getElementById('artworkNext')
        const pagination = document.getElementById('artworkPagination')
        
        artworkPageInfo.textContent = `Página ${artworkCurrentPage} de ${artworkTotalPages}`
        prevBtn.disabled = artworkCurrentPage === 1
        nextBtn.disabled = artworkCurrentPage === artworkTotalPages
        pagination.style.display = artworkTotalPages > 1 ? 'flex' : 'none'
    } catch(error) {
        console.log('Error cargando datos del juego: ', error)
        showErrorState()
    }
}

const openArtworkModal = (imgUrl) => {
    const overlay = document.createElement('div')
    overlay.className = 'artwork-modal-overlay'
    overlay.id = 'artwork-modal-overlay'
    overlay.innerHTML = `
        <button class="artwork-modal-close" title="Cerrar">&times;</button>
        <img class="artwork-modal-img" src="${imgUrl}" alt="Artwork grande">
    `
    document.body.appendChild(overlay)

    // Cerrar al hacer click en el botón o fuera de la imagen
    overlay.querySelector('.artwork-modal-close').onclick = closeArtworkModal
    overlay.onclick = function(e) {
        if(e.target === overlay) closeArtworkModal()
    }
    // Cerrar con ESC
    document.addEventListener('keydown', escCloseArtworkModal)
}

// Cerrar imagen
const closeArtworkModal = () => {
    const overlay = document.getElementById('artwork-modal-overlay')
    if(overlay) overlay.remove()
    document.removeEventListener('keydown', escCloseArtworkModal)
}

const escCloseArtworkModal = (e) => {
    if(e.key === 'Escape') closeArtworkModal()
}

// Eventos de paginación
document.getElementById('artworkPrev').addEventListener('click', () => {
    if (artworkCurrentPage > 1) {
        loadArtwork(artworkCurrentPage - 1)
    }
})

document.getElementById('artworkNext').addEventListener('click', () => {
    if (artworkCurrentPage < artworkTotalPages) {
        loadArtwork(artworkCurrentPage + 1)
    }
})

// BROADCASTS
const loadStreams = async () => {
    try {
        let streams = []

        // const url = `https://games-details.p.rapidapi.com/media/broadcasts/${gameID}?limit=30&offset=0`
        // const response = fetch(url, options)
        const response = await fetch('../db/broadcasts.json') 
        
        if(!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
        }

        result = await response.json()
        streams = result.data.broadcasts

        const streamsContainer = document.getElementById('streamsContainer')
        streamsContainer.innerHTML = ''

        if(streams.length === 0) {
            streamsContainer.innerHTML = '<div class="content-placeholder">No hay streams disponibles.</div>'
        }

        streams.forEach(stream => {
            const item = document.createElement('div')
            item.innerHTML = `
                <iframe 
                    src="${stream}" 
                    frameborder="0" 
                    allowfullscreen 
                    width="100%" 
                    height="340"
                    style="border-radius:12px; background:#181c23; margin-bottom:1.5rem;">
                </iframe>
            `

            streamsContainer.appendChild(item)
        })
    } catch(error) {
        console.log('Error cargando datos del juego: ', error)
        showErrorState()
    }
}

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
    newsControl()
})