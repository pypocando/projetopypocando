document.addEventListener('DOMContentLoaded', function() {
    const menuToggleButton = document.getElementById('menuToggleButton');
    const mainNavigation = document.getElementById('mainNavigation');
    const searchInput = document.querySelector('.search-input'); // Seleciona o input de pesquisa
    const searchButton = document.querySelector('.search-button'); // Seleciona o botão de pesquisa
    let allMoviesData = []; // Variável para armazenar todos os filmes carregados

    if (menuToggleButton && mainNavigation) {
        menuToggleButton.addEventListener('click', function() {
            mainNavigation.classList.toggle('active');
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth >= 769) {
                mainNavigation.classList.remove('active');
            }
        });
    }

    function createMovieCard(movie) {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const img = document.createElement('img');
        img.src = movie.coverUrl;
        img.alt = `Pôster do Filme ${movie.title}`;
        img.loading = 'lazy';

        const p = document.createElement('p');
        p.textContent = movie.title;

        movieCard.appendChild(img);
        movieCard.appendChild(p);

        return movieCard;
    }

    async function renderMovies() {
        const carouselTrack = document.querySelector('.carousel-track');
        const movieGridContainer = document.querySelector('.movie-grid-container');
        const leftArrow = document.querySelector('.left-arrow');
        const rightArrow = document.querySelector('.right-arrow');

        if (!carouselTrack || !movieGridContainer || !leftArrow || !rightArrow) {
            console.error('Um ou mais elementos de contêiner ou seta não foram encontrados. Carrossel ou grade de filmes não serão exibidos corretamente.');
        }

        try {
            const response = await fetch('data/movies.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allMoviesData = await response.json(); // Armazena todos os dados dos filmes
            displayFilteredMovies(allMoviesData); // Exibe todos os filmes inicialmente
        } catch (error) {
            console.error('Erro ao carregar os dados dos filmes:', error);
            return;
        }
    }

    function displayFilteredMovies(moviesToDisplay) {
        const carouselTrack = document.querySelector('.carousel-track');
        const movieGridContainer = document.querySelector('.movie-grid-container');
        const leftArrow = document.querySelector('.left-arrow');
        const rightArrow = document.querySelector('.right-arrow');

        // Limpa os contêineres antes de adicionar novos elementos
        if (carouselTrack) carouselTrack.innerHTML = '';
        if (movieGridContainer) movieGridContainer.innerHTML = '';

        const carouselMovies = moviesToDisplay.filter(movie => movie.sections && movie.sections.includes('lancamento'));
        const gridMovies = moviesToDisplay.filter(movie => movie.sections && movie.sections.includes('filme'));

        // Renderiza filmes no Carrossel (com duplicação para efeito infinito)
        if (carouselMovies.length > 0 && carouselTrack && leftArrow && rightArrow) {
            carouselMovies.forEach(movie => {
                carouselTrack.appendChild(createMovieCard(movie));
            });
            carouselMovies.forEach(movie => {
                carouselTrack.appendChild(createMovieCard(movie));
            });
            carouselMovies.forEach(movie => {
                carouselTrack.appendChild(createMovieCard(movie));
            });
            initializeCarousel(carouselMovies.length);
        } else if (carouselMovies.length > 0) {
            console.warn('Carrossel não pôde ser inicializado completamente devido a elementos ausentes.');
        }

        // Renderiza filmes na Grade
        if (gridMovies.length > 0 && movieGridContainer) {
            gridMovies.forEach(movie => {
                movieGridContainer.appendChild(createMovieCard(movie));
            });
        } else if (gridMovies.length > 0) {
            console.warn('Grade de filmes não pôde ser inicializada completamente devido a elementos ausentes.');
        }
    }

    // Função para inicializar/reinicializar a lógica do carrossel
    function initializeCarousel(numOriginalItems) {
        const carouselTrack = document.querySelector('.carousel-track');
        const leftArrow = document.querySelector('.left-arrow');
        const rightArrow = document.querySelector('.right-arrow');
        
        if (!carouselTrack || !leftArrow || !rightArrow) {
            console.error('Elementos do carrossel (track ou setas) não encontrados para inicialização.');
            return;
        }

        const movieCards = carouselTrack.querySelectorAll('.movie-card');

        if (movieCards.length === 0) return;

        const firstMovieCard = movieCards[0];
        const computedStyle = getComputedStyle(firstMovieCard);
        const itemWidth = firstMovieCard.offsetWidth + parseFloat(computedStyle.marginRight);

        const originalTrackWidth = itemWidth * numOriginalItems;
        carouselTrack.scrollLeft = originalTrackWidth;

        let isScrolling = false;

        function handleInfiniteScroll() {
            if (isScrolling) return;

            if (carouselTrack.scrollLeft >= originalTrackWidth * 2 - carouselTrack.clientWidth - 5) {
                isScrolling = true;
                carouselTrack.scrollLeft = originalTrackWidth;
            } else if (carouselTrack.scrollLeft <= 5) {
                isScrolling = true;
                carouselTrack.scrollLeft = originalTrackWidth;
            }
            setTimeout(() => { isScrolling = false; }, 50);
        }

        carouselTrack.removeEventListener('scroll', handleInfiniteScroll);
        leftArrow.removeEventListener('click', scrollLeft);
        rightArrow.removeEventListener('click', scrollRight);

        carouselTrack.addEventListener('scroll', handleInfiniteScroll);
        leftArrow.addEventListener('click', scrollLeft);
        rightArrow.addEventListener('click', scrollRight);

        function scrollLeft() {
            carouselTrack.scrollBy({
                left: -itemWidth * 2,
                behavior: 'smooth'
            });
        }

        function scrollRight() {
            carouselTrack.scrollBy({
                left: itemWidth * 2,
                behavior: 'smooth'
            });
        }
    }

    // --- Nova lógica de pesquisa ---
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        let filteredMovies = [];

        if (searchTerm.trim() === '') {
            // Se a pesquisa estiver vazia, exibe todos os filmes
            filteredMovies = allMoviesData;
        } else {
            // Filtra os filmes por título (você pode adicionar outras propriedades, como categoria)
            filteredMovies = allMoviesData.filter(movie =>
                movie.title.toLowerCase().includes(searchTerm) ||
                (movie.category && movie.category.toLowerCase().includes(searchTerm))
            );
        }
        displayFilteredMovies(filteredMovies); // Atualiza a exibição com os filmes filtrados
    }

    // Adiciona event listener ao botão de pesquisa
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    // Adiciona event listener para a tecla 'Enter' no campo de pesquisa
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
    // --- Fim da nova lógica de pesquisa ---

    renderMovies(); // Chama a função para renderizar os filmes quando o DOM estiver completamente carregado
});