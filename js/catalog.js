(()=>{
    //VARIABLES
    let currentPage = 1; //página por defecto
    let totalPages = 0; 
    let gameCatalogData = [];



    //BOTONES
    const btnNext = document.getElementById('nextBtn-catalog')
    const btnPrev = document.getElementById('prevBtn-catalog')

    //FUNCIONALIDAD DE BOTONES
    btnNext.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage += 1;
            loadGameList(currentPage);
        }
    });

    btnPrev.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage -= 1;
            loadGameList(currentPage); 
        }
    });


    function updateButtonStates () {
        if (currentPage === 1) {
            btnPrev.disabled = true;
        } else {
            btnPrev.disabled = false;
        }

        if (currentPage === totalPages) {
            btnNext.disabled = true;
        } else {
            btnNext.disabled = false;
        }

    }

    // FUNCIÓN SHOW LOADING STATE y ERROR STATE
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

    // CONEXIÓN A LA API
    async function loadGameList(currentPage) {
        try{
            showLoadingState('catalog');
            //Obtener datos de API
            //const response = await fetch(`https://games-details.p.rapidapi.com/page/${currentPage}`,{
            //    method: 'GET',
	        //    headers: {
		     //       'x-rapidapi-key': '1e5a12f004msh46229e7c88c4743p144147jsnb1b34afac718',
		    //        'x-rapidapi-host': 'games-details.p.rapidapi.com'
            //    }
            //});

            //Info de Archivo JSON
            const response = await fetch('../db/game_catalog_page1.json');

            if(!response.ok){
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const result = await response.json();
            console.log('Datos recibidos:',result);

            gameCatalogData = result.data;

            document.getElementById('catalog').innerHTML = ``;
            
            
            processGameData();
        }
        catch(error){
            console.error('Error cargando catalogo de juegos',error);
            showErrorState();
        }
    }

    function processGameData() {
    //Limpiar HTML
    const container = document.getElementById('catalog');
    container.innerHTML = ''; 

    //Guardar los juegos dentro de una variable, accediendo de los datos guardados a las páginas (por como está estructurado la API)
    const games = gameCatalogData.pages; 

    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card-catalog'; 

        //insertar tarjeta
        gameCard.innerHTML = `
            <img src="${game.img}" alt="${game.name}" class="game-image-catalog" onerror="this.src='../assets/no-image.png'">
            <div class="game-info-catalog">
                <h3 class="game-title-catalog">${game.name}</h3>
                <p class="game-release-catalog">${game.release_date}</p>
                <p class="game-price-catalog">${game.price}</p>
            </div>
        `;

        container.appendChild(gameCard);
    });

    // Actualizar número total de páginas desde la respuesta
    totalPages = gameCatalogData.total_page;
    updateButtonStates(); // Refrescar estado de botones
}


loadGameList(currentPage);
})();