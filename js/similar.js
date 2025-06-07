// IIFE
(() => {
    // SELECTORS

    // VARIABLES
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search');


    // FUNCTIONS
    async function search(searchInput) {
        try {
            if (searchInput) {
                // const response = await fetch(`https://games-details.p.rapidapi.com/search?sugg=${searchInput}`, {
                //     method: 'GET',
                //     headers: {
                //         'x-rapidapi-key': '1e5a12f004msh46229e7c88c4743p144147jsnb1b34afac718',
                //         'x-rapidapi-host': 'games-details.p.rapidapi.com'
                //     }
                // }); 

                const response = await fetch('../db/search.json');

                if (!response.ok) {
                    throw new Error('Error en la peticion');
                }

                const result = await response.json();
                console.log(result);
                

                if (result?.status == 200) {
                    console.log('Resultado de la busqueda:', result?.data?.search);

                    return result?.data?.search;
                } else {
                    return [];
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function handleContentLoaded(event) {
        event.preventDefault();
        const titleH2 = document.querySelector('#busqueda-title');
        const gamesContentDiv = document.querySelector('#games-content');
        try {
            if (searchQuery) {
                // Limpiar contendio
                gamesContentDiv.innerHTML = '';

                // AJUSTAR TITULO
                titleH2.innerHTML = `🔍 Resultados para: <span style="font-weight: 700">${searchQuery}</span>`

                // REALIZAR BUSQUEDA
                // Cargando
                gamesContentDiv.innerHTML = `
                <div id="loader" class="loader-overlay">
                    <div class="spinner"></div>
                </div>
                `

                // Consulta de busqueda
                const gamesResult = await search(searchQuery.toString());

                if (gamesResult) {
                    gamesResultHTML = ``;

                    gamesResult.forEach(game => {
                        gameHTML = `
                            <div class="game-card" data-id=${game?.id || null}>
                              <div class="game-image"><img src="${game.image}" alt="${game.name}" /></div>
                              <div class="game-info">
                                <h3>${game.name || 'Sin título'}</h3>
                                <p>Precio: ${game.price || 'Sin precio'}</p>
                                <!-- <div class="game-rating">⭐⭐⭐⭐⭐</div> -->
                              </div>
                            </div>
                        `
                        gamesResultHTML += gameHTML;
                    })

                    gamesContentDiv.innerHTML = gamesResultHTML;

                    // Agregar eventos a cada targeta para redirigir a sus detalles
                    const gameCards = document.querySelectorAll('.game-card');
                    gameCards.forEach(card => {
                        const gameID = card.getAttribute('data-id');
                        card.addEventListener('click', () => {
                            window.location.href = `/pages/games_info.html?id=${encodeURIComponent(gameID)}`;
                        });
                    })
                } else {
                    gamesContentDiv.innerHTML = '🫠 Sin resultados...';
                }
            } else {
                gamesContentDiv.innerHTML = '🚫 Sin busqueda...';
            }
        } catch (error) {

        }
    }

    // EVENT LISTENERS
    function eventListeners() {
        window.addEventListener('DOMContentLoaded', handleContentLoaded);
    }


    eventListeners();
})();
