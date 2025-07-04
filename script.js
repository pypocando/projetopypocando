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
        const leftArrow = document.querySelector('.left-arrow');
        const rightArrow = document.querySelector('.right-arrow');

        if (!carouselTrack || !movieGridContainer || !leftArrow || !rightArrow) {
            console.error('Um ou mais elementos de contêiner ou seta não foram encontrados.');
            return;
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
            return;
        }

        // Limpa contêineres antes de adicionar novos elementos (caso haja conteúdo anterior)
        carouselTrack.innerHTML = '';
        movieGridContainer.innerHTML = '';

        // *** MUDANÇA AQUI: Filtra filmes usando o array 'sections' ***
        const carouselMovies = moviesData.filter(movie => movie.sections && movie.sections.includes('lancamento'));
        const gridMovies = moviesData.filter(movie => movie.sections && movie.sections.includes('filme'));

        // Renderiza filmes no Carrossel (com duplicação para efeito infinito)
        if (carouselMovies.length > 0) {
            // Adiciona a "cópia inicial" dos filmes (para rolagem para a esquerda)
            carouselMovies.forEach(movie => {
                carouselTrack.appendChild(createMovieCard(movie));
            });

            // Adiciona os filmes originais
            carouselMovies.forEach(movie => {
                carouselTrack.appendChild(createMovieCard(movie));
            });

            // Adiciona a "cópia final" dos filmes (para rolagem para a direita)
            carouselMovies.forEach(movie => {
                carouselTrack.appendChild(createMovieCard(movie));
            });

            // Inicializa a lógica de carrossel infinito APÓS os elementos terem sido adicionados ao DOM
            initializeCarousel(carouselMovies.length);
        }

        // Renderiza filmes na Grade
        if (gridMovies.length > 0) {
            gridMovies.forEach(movie => {
                movieGridContainer.appendChild(createMovieCard(movie));
            });
        }
    }

    // Função para inicializar/reinicializar a lógica do carrossel
    function initializeCarousel(numOriginalItems) {
        const carouselTrack = document.querySelector('.carousel-track');
        const leftArrow = document.querySelector('.left-arrow');
        const rightArrow = document.querySelector('.right-arrow');
        const movieCards = carouselTrack.querySelectorAll('.movie-card'); // Pega os cards recém-criados

        if (movieCards.length === 0) return; // Nenhuma carta para inicializar

        // Certifique-se de que o itemWidth é calculado após a renderização e com o CSS aplicado
        const firstMovieCard = movieCards[0];
        const computedStyle = getComputedStyle(firstMovieCard);
        const itemWidth = firstMovieCard.offsetWidth + parseFloat(computedStyle.marginRight);

        // A largura da pista original é o número de itens originais * a largura de um item
        const originalTrackWidth = itemWidth * numOriginalItems;

        // Define a posição inicial da rolagem para o início do segundo conjunto de itens (os "originais")
        carouselTrack.scrollLeft = originalTrackWidth;

        let isScrolling = false; // Flag para controlar rolagem manual e evitar loops infinitos de evento

        function handleInfiniteScroll() {
            if (isScrolling) return; // Se já estiver manipulando a rolagem, saia

            // Se rolou para a "parte duplicada" final, salta de volta para o início da parte original
            // Adicionado uma pequena margem de erro para garantir o trigger
            if (carouselTrack.scrollLeft >= originalTrackWidth * 2 - carouselTrack.clientWidth - 5) {
                isScrolling = true;
                carouselTrack.scrollLeft = originalTrackWidth;
            }
            // Se rolou para a "parte duplicada" inicial, salta para o final da parte original
            else if (carouselTrack.scrollLeft <= 5) { // Pequena margem de erro para o limite esquerdo
                isScrolling = true;
                carouselTrack.scrollLeft = originalTrackWidth;
            }
            // Reseta a flag após um pequeno timeout para permitir novas rolagem
            setTimeout(() => { isScrolling = false; }, 50); // Ajuste o tempo se necessário
        }

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
                left: -itemWidth * 2, // Rola por 2 itens
                behavior: 'smooth'
            });
        }

        function scrollRight() {
            carouselTrack.scrollBy({
                left: itemWidth * 2, // Rola por 2 itens
                behavior: 'smooth'
            });
        }
    }

    // Chama a função para renderizar os filmes quando o DOM estiver completamente carregado
    renderMovies();
});