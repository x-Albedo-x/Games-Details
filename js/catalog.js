(() => {
    // VARIABLES
    let currentPage = parseInt(sessionStorage.getItem('currentCatalogPage')) || 1;
    let totalPages = 0;
    let gameCatalogData = [];

    // BOTONES
    const btnNext = document.getElementById('nextBtn-catalog');
    const btnPrev = document.getElementById('prevBtn-catalog');
    const btnRandomGame = document.getElementById('random-game');

    // Función para generar número aleatorio
    function numeroAleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // FUNCIONALIDAD DE BOTONES
    btnNext.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage += 1;
            sessionStorage.setItem('currentCatalogPage', currentPage);
            loadGameList(currentPage);
        }
    });

    btnPrev.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage -= 1;
            sessionStorage.setItem('currentCatalogPage', currentPage);
            loadGameList(currentPage);
        }
    });

    // Actualizar visibilidad de botones
    function updateButtonStates() {
        const contBtn = document.getElementById('btn-catalog');
        if (currentPage === 1) {
            btnPrev.style.display = 'none';
            contBtn.style.justifyContent = 'flex-end';
        } else {
            btnPrev.style.display = 'inline-block';
            contBtn.style.justifyContent = 'space-between';
        }

        if (currentPage === totalPages) {
            btnNext.style.display = 'none';
            contBtn.style.justifyContent = 'flex-start';
        } else {
            btnNext.style.display = 'inline-block';
        }
    }

    // Estado de carga
    function showLoadingState(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="loading" style="text-align: center; padding: 2rem;">
                    <div class="spinner" style="margin: 0 auto;"></div>
                    <p style="margin-top: 1rem; color: rgba(255,255,255,0.6);">Cargando...</p>
                </div>
            `;
        }
    }

    // Estado de error
    function showErrorState() {
        const container = document.getElementById('catalog');
        container.innerHTML = `
            <div class="container" style="text-align: center; padding: 4rem 2rem;">
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

    // FUNCIÓN PARA CARGAR LOS JUEGOS
    async function loadGameList(currentPage) {
        try {
            showLoadingState('catalog');

            const response = await fetch(`https://games-details.p.rapidapi.com/page/${currentPage}`, {
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
            console.log('Datos recibidos:', result);

            gameCatalogData = result.data;

            document.getElementById('catalog').innerHTML = '';
            processGameData(); // Crear tarjetas
        } catch (error) {
            console.error('Error cargando catálogo de juegos', error);
            showErrorState();
        }
    }

    // PROCESAR Y MOSTRAR TARJETAS DE JUEGOS
    function processGameData() {
        const container = document.getElementById('catalog');
        container.innerHTML = '';

        const games = gameCatalogData.pages;

        games.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card-catalog';

            gameCard.innerHTML = `
                <img src="${game.img}" alt="${game.name}" class="game-image-catalog" onerror="this.src='../assets/no-image.png'">
                <div class="game-info-catalog">
                    <h3 class="game-title-catalog">${game.name}</h3>
                    <p class="game-release-catalog"><b>Fecha de Lanzamiento: </b>${game.release_date}</p>
                    <p class="game-price-catalog"><b>Precio: </b>${game.price}</p>
                </div>
            `;

            gameCard.addEventListener('click', () => {
                localStorage.setItem('game_data_' + game.id, JSON.stringify({
                    image: game.img,
                    price: game.price
                }));
                window.location.href = `pages/games_info.html?id=${encodeURIComponent(game.id)}`;
            });

            container.appendChild(gameCard);
        });

        totalPages = gameCatalogData.total_page;
        updateButtonStates();
        showrandomGame(); // Mostrar juego aleatorio cada vez que se carga una página
    }

    // JUEGO ALEATORIO
    function showrandomGame() {

        const games = gameCatalogData.pages;
        if (!games || games.length === 0) return;

        const juego = games[numeroAleatorio(0, games.length - 1)];
        const contenedor = document.getElementById('game-placeholder');

        // Guardar los datos necesarios para pasarlos a la página de game-info
        localStorage.setItem('game_data_' + juego.id, JSON.stringify({
            image: juego.img,
            price: juego.price
        }));

        //poner imagen y titulo del juego
        contenedor.innerHTML = `
            <a class="random-game-card" href="pages/games_info.html?id=${encodeURIComponent(juego.id)}">
                <img src="${juego.img}" alt="${juego.name}" onerror="this.src='../assets/no-image.png'">
                <h3>${juego.name}</h3>
            </a>
        `;
}



    btnRandomGame.addEventListener('click', showrandomGame);

    // Cargar primera página
    loadGameList(currentPage);
})();
