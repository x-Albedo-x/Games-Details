// IIFE
(() => {
    // SELECTORS
    const searchButton = document.querySelector('#searchButton');
    const searchInput = document.querySelector('#searchInput');

    // VARIABLES

    // FUNCTIONS
    function handleSearchButtonClick(event) {
        event.preventDefault(); // previene las acciones por defecto del formulario

        // Input de la busqueda
        const searchInputValue = searchInput.value;
        window.location = `/pages/similar.html?search=${encodeURIComponent(searchInputValue)}`
    }

    // EVENT LISTENERS
    function eventListeners() {
        searchButton.addEventListener('click', handleSearchButtonClick);
        searchInput.addEventListener('keypress', event => {
            if (event.key === 'Enter') {
                handleSearchButtonClick(event);
            }
        })
    }


    eventListeners();
})();