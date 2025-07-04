document.addEventListener('DOMContentLoaded', function() {
    const menuToggleButton = document.getElementById('menuToggleButton');
    const mainNavigation = document.getElementById('mainNavigation'); // Alterado para mainNavigation

    // Lógica para o botão de menu hambúrguer (agora para a navegação superior)
    if (menuToggleButton && mainNavigation) {
        menuToggleButton.addEventListener('click', function() {
            mainNavigation.classList.toggle('active');
        });

        // Fechar a navegação ao redimensionar para desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 769) {
                mainNavigation.classList.remove('active');
            }
        });
    }

    // Função auxiliar para criar um movie-card
    function createMovieCard(movie) {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const img = document.createElement('img');
        img.src = movie.coverUrl;
        img.alt = `Pôster do Filme ${movie.title}`;
        img.loading = 'lazy'; // Otimização para carregamento de imagens

        const p = document.createElement('p');
        p.textContent = movie.title;

        movieCard.appendChild(img);
        movieCard.appendChild(p);

        return movieCard;
    }

    // Função principal para renderizar os filmes
    async function renderMovies() {
        const carouselTrack = document.querySelector('.carousel-track');
        const movieGridContainer = document.querySelector('.movie-grid-container');

        // Carregar dados dos filmes do JSON
        try {
            const response = await fetch('movies.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const moviesData = await response.json();

            // Renderizar filmes no carrossel de lançamentos
            if (carouselTrack) {
                // Duplica os filmes para criar o efeito de carrossel infinito
                // Garante que haja conteúdo suficiente para rolagem "infinita"
                const allMoviesForCarousel = [...moviesData, ...moviesData, ...moviesData]; // Adiciona 3 sets para um loop suave
                allMoviesForCarousel.forEach(movie => {
                    carouselTrack.appendChild(createMovieCard(movie));
                });
                initializeCarousel(carouselTrack, moviesData.length); // Passa o número de filmes originais
            }

            // Renderizar filmes na grade principal
            if (movieGridContainer) {
                moviesData.forEach(movie => {
                    movieGridContainer.appendChild(createMovieCard(movie));
                });
            }

        } catch (error) {
            console.error('Erro ao carregar os filmes:', error);
            // Optionally display a message to the user
        }
    }

    // Função para inicializar o carrossel (agora mais robusta)
    function initializeCarousel(carouselTrack, originalMoviesCount) {
        const leftArrow = carouselTrack.previousElementSibling;
        const rightArrow = carouselTrack.nextElementSibling;
        const movieCards = carouselTrack.querySelectorAll('.movie-card');

        if (movieCards.length === 0) return;

        // Calcula a largura de um item do carrossel, incluindo a margem
        const itemWidth = movieCards[0].offsetWidth + parseInt(window.getComputedStyle(movieCards[0]).marginRight);

        // Salva a largura da parte "original" do carrossel (um ciclo completo de filmes)
        const originalTrackWidth = itemWidth * originalMoviesCount;

        let isScrolling = false; // Flag para evitar múltiplas chamadas durante a rolagem

        function handleInfiniteScroll() {
            if (isScrolling) return;

            // Verifica se o scroll atingiu o final da segunda cópia (quase no início do terceiro set)
            // Se sim, "teletransporta" para o início da segunda cópia para a ilusão de infinito
            if (carouselTrack.scrollLeft >= originalTrackWidth * 2 - (itemWidth / 2)) {
                isScrolling = true;
                carouselTrack.scrollLeft = originalTrackWidth;
            }
            // Verifica se o scroll voltou para o início da primeira cópia (quase no final do primeiro set)
            // Se sim, "teletransporta" para o início da terceira cópia para a ilusão de infinito ao rolar para trás
            else if (carouselTrack.scrollLeft <= originalTrackWidth - (itemWidth / 2)) {
                isScrolling = true;
                carouselTrack.scrollLeft = originalTrackWidth * 2;
            }

            // Reseta a flag após um pequeno timeout para permitir novas rolagem
            setTimeout(() => { isScrolling = false; }, 50); // Ajuste o tempo se necessário
        }

        // Adjust the initial scroll position to be in the middle "original" set
        carouselTrack.scrollLeft = originalTrackWidth;

        // Remove listeners antigos para evitar duplicação se initializeCarousel for chamado múltiplas vezes
        carouselTrack.removeEventListener('scroll', handleInfiniteScroll);
        leftArrow.removeEventListener('click', scrollLeft);
        rightArrow.removeEventListener('click', scrollRight);

        // Adiciona novos listeners
        carouselTrack.addEventListener('scroll', handleInfiniteScroll);
        leftArrow.addEventListener('click', scrollLeft);
        rightArrow.addEventListener('click', scrollRight);

        function scrollLeft() {
            carouselTrack.scrollBy({
                left: -itemWidth, // Rola por 1 item
                behavior: 'smooth'
            });
        }

        function scrollRight() {
            carouselTrack.scrollBy({
                left: itemWidth, // Rola por 1 item
                behavior: 'smooth'
            });
        }
    }

    // Chama a função para renderizar os filmes quando o DOM estiver completamente carregado
    renderMovies();
});