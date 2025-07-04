document.addEventListener('DOMContentLoaded', function() {
    const menuToggleButton = document.getElementById('menuToggleButton');
    const mainNavigation = document.getElementById('mainNavigation');

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

        // Adicionei uma verificação mais robusta aqui para garantir que todos os elementos existem
        if (!carouselTrack || !movieGridContainer || !leftArrow || !rightArrow) {
            console.error('Um ou mais elementos de contêiner ou seta não foram encontrados. Carrossel ou grade de filmes não serão exibidos corretamente.');
            // Não retorne aqui, pois ainda queremos tentar renderizar a grade se o carrossel falhar e vice-versa.
            // A inicialização do carrossel será guardada por sua própria verificação.
        }

        let moviesData = [];
        try {
            const response = await fetch('data/movies.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            moviesData = await response.json();
        } catch (error) {
            console.error('Erro ao carregar os dados dos filmes:', error);
            return; // Retorna aqui se os dados não puderem ser carregados
        }

        carouselTrack.innerHTML = '';
        movieGridContainer.innerHTML = '';

        const carouselMovies = moviesData.filter(movie => movie.sections && movie.sections.includes('lancamento'));
        const gridMovies = moviesData.filter(movie => movie.sections && movie.sections.includes('filme'));

        if (carouselMovies.length > 0 && carouselTrack && leftArrow && rightArrow) { // Verifica novamente as setas antes de preencher o carrossel
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


        if (gridMovies.length > 0 && movieGridContainer) { // Verifica se o contêiner da grade existe
            gridMovies.forEach(movie => {
                movieGridContainer.appendChild(createMovieCard(movie));
            });
        } else if (gridMovies.length > 0) {
             console.warn('Grade de filmes não pôde ser inicializada completamente devido a elementos ausentes.');
        }
    }

    function initializeCarousel(numOriginalItems) {
        const carouselTrack = document.querySelector('.carousel-track');
        const leftArrow = document.querySelector('.left-arrow');
        const rightArrow = document.querySelector('.right-arrow');
        
        // Adicionada uma verificação de existência dos elementos aqui também
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

        // Remover os listeners antigos antes de adicionar novos é uma boa prática
        // para evitar duplicação caso a função initializeCarousel seja chamada múltiplas vezes (ex: por resize)
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

    renderMovies();
});