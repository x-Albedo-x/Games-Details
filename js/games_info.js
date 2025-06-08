(() => {
    // VARIABLES
    const params = new URLSearchParams(window.location.search);
    const gameID = params.get('id');
    let gameData = null;

    // UTILITY FUNCTIONS
    function safeGet(obj, path, defaultValue = '') {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : defaultValue;
        }, obj);
    }

    function safeArray(arr, defaultValue = []) {
        return Array.isArray(arr) ? arr : defaultValue;
    }

    function safeString(str, defaultValue = 'No disponible') {
        return str && typeof str === 'string' && str.trim() !== '' ? str : defaultValue;
    }

    function showNoDataMessage(container, message = 'No hay información disponible') {
        if (container) {
            container.innerHTML = `
                <div class="content-placeholder" style="text-align: center; color: rgba(255,255,255,0.6);">
                    <p>${message}</p>
                </div>
            `;
        }
    }

    function showLoadingState() {
        const loader = document.getElementById('gameLoader');
        if (loader) loader.style.display = 'block';
        const mainSection = document.querySelector('.main-section');
        if (mainSection) mainSection.style.display = 'none';
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.style.display = 'none';
    }

    function hideLoadingState() {
        const loader = document.getElementById('gameLoader');
        if (loader) loader.style.display = 'none';
        const mainSection = document.querySelector('.main-section');
        if (mainSection) mainSection.style.display = '';
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.style.display = '';
    }

    // MAIN FUNCTIONS
    async function loadGameData() {
        try {
            // Mostrar estados de carga
            showLoadingState();

            // const response = await fetch(`https://games-details.p.rapidapi.com/gameinfo/single_game/${gameID}`, {
            //     method: 'GET',
            //     headers: {
            //         'x-rapidapi-key': '1e5a12f004msh46229e7c88c4743p144147jsnb1b34afac718',
            //         'x-rapidapi-host': 'games-details.p.rapidapi.com'
            //     }
            // });
            const response = await fetch('../db/game_info.json');

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Datos recibidos:', result);

            gameData = result.data;

            // Ocultar carga
            hideLoadingState();
            // Procesar datos con validaciones
            processGameData();

        } catch (error) {
            console.error('Error cargando datos del juego:', error);
            showErrorState();
        }
    }

    function processGameData() {
        // Título y descripción principal
        const gameName = safeString(gameData?.name, 'Juego sin nombre');
        const gameDesc = safeString(gameData?.desc, 'Sin descripción disponible');
        const aboutGame = safeString(gameData?.about_game, 'Sin información adicional disponible');

        document.getElementById('gameName').textContent = gameName;
        document.getElementById('gameDescription').textContent = gameDesc;
        document.getElementById('aboutGame').textContent = aboutGame;

        // Imagen principal
        loadMainImage();

        // Tags
        loadTags();

        // Detalles del juego
        loadGameDetails();

        // Precios
        loadPricing();

        // Enlaces externos
        loadExternalLinks();

        // Detalles del desarrollador
        loadDeveloperDetails();

        // Idiomas
        loadLanguages();

        // Screenshots
        loadScreenshots();

        // Videos
        loadVideos();

        // Requisitos del sistema
        loadSystemRequirements();
    }

    function loadMainImage() {
        const mainImage = document.getElementById('gameMainImage');
        const screenshots = safeArray(safeGet(gameData, 'images.screenshot'));

        if (screenshots.length > 0 && screenshots[0]) {
            mainImage.src = screenshots[0];
            mainImage.alt = safeString(gameData?.name, 'Screenshot del juego');
            mainImage.onerror = () => {
                mainImage.style.display = 'none';
                mainImage.parentElement.innerHTML = `
                    <div class="game-placeholder" style="display: flex; align-items: center; justify-content: center; min-height: 200px;">
                        <div style="text-align: center; color: rgba(255,255,255,0.6);">
                            <span style="font-size: 4rem;">🎮</span>
                            <p>Sin imagen disponible</p>
                        </div>
                    </div>
                `;
            };
        } else {
            mainImage.style.display = 'none';
            mainImage.parentElement.innerHTML = `
                <div class="game-placeholder" style="display: flex; align-items: center; justify-content: center; min-height: 200px;">
                    <div style="text-align: center; color: rgba(255,255,255,0.6);">
                        <span style="font-size: 4rem;">🎮</span>
                        <p>Sin imagen disponible</p>
                    </div>
                </div>
            `;
        }
    }

    function loadTags() {
        const tagsContainer = document.getElementById('gameTagsContainer');
        const tags = safeArray(gameData?.tags);

        if (tags.length === 0) {
            tagsContainer.innerHTML = '<span class="tag">Sin categorías</span>';
            return;
        }

        tags.slice(0, 8).forEach(tag => {
            if (tag && typeof tag === 'string') {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            }
        });
    }

    function loadGameDetails() {
        const gameDetails = document.getElementById('gameDetails');
        const releaseDate = safeString(gameData?.release_date, 'No especificada');
        const developers = safeArray(safeGet(gameData, 'dev_details.developer_name'));
        const publishers = safeArray(safeGet(gameData, 'dev_details.publisher'));
        const tags = safeArray(gameData?.tags);

        gameDetails.innerHTML = `
            <div class="detail-item">
                <span><strong>Fecha de lanzamiento:</strong></span>
                <span>${releaseDate}</span>
            </div>
            <div class="detail-item">
                <span><strong>Desarrollador:</strong></span>
                <span>${developers.length > 0 ? developers.join(', ') : 'No especificado'}</span>
            </div>
            <div class="detail-item">
                <span><strong>Editor:</strong></span>
                <span>${publishers.length > 0 ? publishers.join(', ') : 'No especificado'}</span>
            </div>
            <div class="detail-item">
                <span><strong>Géneros:</strong></span>
                <span>${tags.length > 0 ? tags.slice(0, 5).join(', ') : 'No especificados'}</span>
            </div>
        `;
    }

    function loadPricing() {
        const pricingContainer = document.getElementById('pricingContainer');
        const pricing = safeArray(gameData?.pricing);

        if (pricing.length === 0) {
            showNoDataMessage(pricingContainer, 'Información de precios no disponible');
            return;
        }

        pricing.forEach(priceOption => {
            if (priceOption && (priceOption.name || priceOption.price)) {
                const priceElement = document.createElement('div');
                priceElement.className = 'detail-item';
                priceElement.innerHTML = `
                    <span><strong>${safeString(priceOption.name, 'Opción')}:</strong></span>
                    <span style="color: #a6e3a1; font-weight: bold;">${safeString(priceOption.price, 'No especificado')}</span>
                `;
                pricingContainer.appendChild(priceElement);
            }
        });
    }

    function loadExternalLinks() {
        const linksContainer = document.getElementById('externalLinksContainer');
        const externalLinks = safeArray(gameData?.external_links);

        if (externalLinks.length === 0) {
            showNoDataMessage(linksContainer, 'No hay enlaces externos disponibles');
            return;
        }

        externalLinks.forEach(link => {
            if (link && link.link && link.name) {
                const linkElement = document.createElement('a');
                linkElement.className = 'external-link';
                linkElement.href = link.link;
                linkElement.target = '_blank';
                linkElement.rel = 'noopener noreferrer';
                linkElement.innerHTML = `
                    <span>🌐</span>
                    <span>${link.name.charAt(0).toUpperCase() + link.name.slice(1)}</span>
                `;
                linksContainer.appendChild(linkElement);
            }
        });
    }

    function loadDeveloperDetails() {
        const developerDetails = document.getElementById('developerDetails');
        const developers = safeArray(safeGet(gameData, 'dev_details.developer_name'));
        const publishers = safeArray(safeGet(gameData, 'dev_details.publisher'));

        developerDetails.innerHTML = `
            <div class="detail-item">
                <span><strong>Desarrollador:</strong></span>
                <span>${developers.length > 0 ? developers.join(', ') : 'No especificado'}</span>
            </div>
            <div class="detail-item">
                <span><strong>Editor:</strong></span>
                <span>${publishers.length > 0 ? publishers.join(', ') : 'No especificado'}</span>
            </div>
        `;
    }

    function loadLanguages() {
        const languagesContainer = document.getElementById('languagesContainer');
        const languages = safeArray(gameData?.lang);

        if (languages.length === 0) {
            showNoDataMessage(languagesContainer, 'Información de idiomas no disponible');
            return;
        }

        languages.slice(0, 10).forEach(language => {
            if (language && typeof language === 'string') {
                const langElement = document.createElement('span');
                langElement.className = 'tag';
                langElement.style.background = 'rgba(102, 217, 239, 0.2)';
                langElement.style.color = '#66d9ef';
                langElement.textContent = language;
                languagesContainer.appendChild(langElement);
            }
        });
    }

    function loadScreenshots() {
        const screenshotsGallery = document.getElementById('screenshotsGallery');
        const screenshots = safeArray(safeGet(gameData, 'images.screenshot'));

        if (screenshots.length === 0) {
            showNoDataMessage(screenshotsGallery, 'No hay capturas de pantalla disponibles');
            return;
        }

        screenshots.slice(0, 12).forEach((screenshot, index) => {
            if (screenshot && typeof screenshot === 'string') {
                const imgElement = document.createElement('div');
                imgElement.className = 'gallery-item';
                imgElement.innerHTML = `
                    <img src="${screenshot}" alt="Screenshot ${index + 1}" 
                         style="width: 100%; height: 100%; object-fit: cover; border-radius: 15px;"
                         onerror="this.parentElement.innerHTML='<div style=\'display:flex;align-items:center;justify-content:center;height:100%;color:rgba(255,255,255,0.6);\'><span>📷</span><p>Error al cargar</p></div>'">
                `;
                imgElement.addEventListener('click', () => openImageModal(screenshot));
                screenshotsGallery.appendChild(imgElement);
            }
        });
    }

    function loadVideos() {
        const videosContainer = document.getElementById('videosContainer');
        const videos = safeArray(safeGet(gameData, 'images.videos'));

        if (videos.length === 0) {
            showNoDataMessage(videosContainer, 'No hay videos disponibles');
            return;
        }

        videos.forEach((video, index) => {
            if (video && typeof video === 'string') {
                const videoElement = document.createElement('div');
                videoElement.className = 'video-item';
                videoElement.innerHTML = `
                    <div class="video-placeholder">
                        <span class="play-icon">▶️</span>
                        <p>Video ${index + 1}</p>
                    </div>
                `;
                videoElement.addEventListener('click', () => playVideo(video));
                videosContainer.appendChild(videoElement);
            }
        });
    }

    function loadSystemRequirements() {
        const sysReqContainer = document.getElementById('systemRequirements');
        const sysReq = gameData?.sys_req;

        if (!sysReq) {
            showNoDataMessage(sysReqContainer, 'Requisitos del sistema no disponibles');
            return;
        }

        const platforms = [];

        // Windows
        if (sysReq.window) {
            const windowsMin = safeArray(sysReq.window.min);
            const windowsRecomm = safeArray(sysReq.window.recomm);

            if (windowsMin.length > 0 || windowsRecomm.length > 0) {
                platforms.push(createRequirementSection('🖥️ Windows', windowsMin, windowsRecomm));
            }
        }

        // Linux
        if (sysReq.linux) {
            const linuxMin = safeArray(sysReq.linux.min);
            const linuxRecomm = safeArray(sysReq.linux.recomm);

            if (linuxMin.length > 0 || linuxRecomm.length > 0) {
                platforms.push(createRequirementSection('🐧 Linux', linuxMin, linuxRecomm));
            }
        }

        // Mac
        if (sysReq.mac) {
            const macMin = safeArray(sysReq.mac.min);
            const macRecomm = safeArray(sysReq.mac.recomm);

            if (macMin.length > 0 || macRecomm.length > 0) {
                platforms.push(createRequirementSection('🍎 MacOS', macMin, macRecomm));
            }
        }

        if (platforms.length === 0) {
            showNoDataMessage(sysReqContainer, 'Requisitos del sistema no disponibles');
            return;
        }

        platforms.forEach(platform => {
            sysReqContainer.appendChild(platform);
        });
    }

    function createRequirementSection(title, minReqs, recommReqs) {
        const section = document.createElement('div');
        section.className = 'req-section';

        let content = `<h3>${title}</h3><div style="display: grid; gap: 1rem;">`;

        if (minReqs.length > 0) {
            content += `
                <div>
                    <h4 style="color: #a6e3a1; margin-bottom: 0.5rem;">Mínimos:</h4>
                    <ul style="color: rgba(255,255,255,0.8); line-height: 1.6;">
                        ${minReqs.filter(req => req && typeof req === 'string').map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        if (recommReqs.length > 0) {
            content += `
                <div>
                    <h4 style="color: #f9e2af; margin-bottom: 0.5rem;">Recomendados:</h4>
                    <ul style="color: rgba(255,255,255,0.8); line-height: 1.6;">
                        ${recommReqs.filter(req => req && typeof req === 'string').map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        content += '</div>';
        section.innerHTML = content;
        return section;
    }

    function showErrorState() {
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

    // Modal functions remain the same but with error handling
    function openImageModal(imageSrc) {
        if (!imageSrc) return;

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            cursor: pointer;
        `;

        const img = document.createElement('img');
        img.src = imageSrc;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        `;

        img.onerror = () => {
            modal.innerHTML = `
                <div style="text-align: center; color: white;">
                    <p style="font-size: 2rem;">📷</p>
                    <p>Error al cargar la imagen</p>
                </div>
            `;
        };

        modal.appendChild(img);
        document.body.appendChild(modal);

        modal.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    function playVideo(videoSrc) {
        if (!videoSrc) return;

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        const video = document.createElement('video');
        video.src = videoSrc;
        video.controls = true;
        video.autoplay = true;
        video.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 10px;
        `;

        video.onerror = () => {
            modal.innerHTML = `
                <div style="text-align: center; color: white;">
                    <p style="font-size: 2rem;">🎬</p>
                    <p>Error al cargar el video</p>
                    <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #66d9ef; border: none; border-radius: 5px; cursor: pointer;">Cerrar</button>
                </div>
            `;
        };

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 2rem;
            border-radius: 50%;
            cursor: pointer;
            width: 55px;
            height: 55px;
        `;

        modal.appendChild(video);
        modal.appendChild(closeBtn);
        document.body.appendChild(modal);

        const closeModal = () => {
            document.body.removeChild(modal);
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // EVENT LISTENERS
    function eventListeners() {
        document.addEventListener('DOMContentLoaded', loadGameData)
    }

    eventListeners();
})();