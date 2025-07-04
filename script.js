document.addEventListener('DOMContentLoaded', function() {
    const menuToggleButton = document.getElementById('menuToggleButton');
    const sidebar = document.getElementById('sidebar');
    const contentWrapper = document.getElementById('contentWrapper');

    // Elementos do Modal
    const movieDetailsModal = document.getElementById('movieDetailsModal');
    const closeButton = document.querySelector('.close-button');
    const modalMovieCover = document.getElementById('modalMovieCover');
    const modalMovieTitle = document.getElementById('modalMovieTitle');
    const modalMovieCategory = document.getElementById('modalMovieCategory');
    const modalMovieReleaseDate = document.getElementById('modalMovieReleaseDate');
    const modalWatchButton = document.getElementById('modalWatchButton');

    // Lógica para o botão de menu hambúrguer (agora para a navegação superior)
    if (menuToggleButton && sidebar && contentWrapper) {
        menuToggleButton.addEventListener('click', function() {
            sidebar.classList.toggle('active'); // Adiciona/remove a classe 'active' na sidebar
            contentWrapper.classList.toggle('sidebar-open'); // Adiciona/remove a classe 'sidebar-open' no content-wrapper
        });

        // Fechar a sidebar ao clicar fora dela (apenas para mobile)
        contentWrapper.addEventListener('click', function(event) {
            // Verifica se a sidebar está aberta E o clique não foi no botão de alternância nem na própria sidebar
            if (window.innerWidth <= 768 && sidebar.classList.contains('active') && !sidebar.contains(event.target) && !menuToggleButton.contains(event.target)) {
                sidebar.classList.remove('active');
                contentWrapper.classList.remove('sidebar-open');
            }
        });

        // Fechar sidebar ao redimensionar a janela (para desktop, se ela estiver aberta do mobile)
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 769) { // Se a tela for desktop
                sidebar.classList.remove('active'); // Garante que a sidebar não fique "ativa" (aberta)
                contentWrapper.classList.remove('sidebar-open'); // Remove o push do conteúdo
            }
        });
    }

    // Função auxiliar para criar um movie-card
    function createMovieCard(movie) {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.setAttribute('data-movie-id', movie.id); // Adiciona o ID do filme para fácil acesso

        const img = document.createElement('img');
        img.src = movie.coverUrl;
        img.alt = `Pôster do Filme ${movie.title}`;
        img.loading = 'lazy'; // Otimização para carregamento de imagens

        const p = document.createElement('p');
        p.textContent = movie.title;

        movieCard.appendChild(img);
        movieCard.appendChild(p);

        // Adiciona o event listener para cada card de filme
        movieCard.addEventListener('click', () => openMovieDetails(movie));

        return movieCard;
    }

    // Função para abrir o modal de detalhes do filme
    function openMovieDetails(movie) {
        modalMovieCover.src = movie.coverUrl;
        modalMovieCover.alt = `Capa do Filme ${movie.title}`;
        modalMovieTitle.textContent = movie.title;
        modalMovieCategory.textContent = movie.category;
        modalMovieReleaseDate.textContent = movie.releaseDate;

        // Lógica do botão "Assistir Agora"
        // IMPORTANTE: Aqui você pode colocar o link REAL para onde o filme pode ser assistido.
        // Por segurança, NUNCA linke para sites de streaming ilegais ou desconhecidos.
        // Use links para plataformas legítimas (ex: YouTube para trailers, Netflix, Amazon Prime, etc.,
        // se o filme estiver realmente disponível lá e você tiver as URLs).
        if (movie.watchLink) { // Supondo que você pode ter um 'watchLink' no seu movies.json
            modalWatchButton.style.display = 'block'; // Mostra o botão
            modalWatchButton.onclick = () => window.open(movie.watchLink, '_blank');
        } else {
            modalWatchButton.style.display = 'none'; // Esconde o botão se não houver link
        }

        movieDetailsModal.classList.add('show'); // Adiciona a classe 'show' para exibir o modal
    }

    // Função para fechar o modal
    closeButton.addEventListener('click', () => {
        movieDetailsModal.classList.remove('show'); // Remove a classe 'show' para esconder o modal
    });

    // Fechar o modal clicando fora do conteúdo
    window.addEventListener('click', (event) => {
        if (event.target == movieDetailsModal) {
            movieDetailsModal.classList.remove('show');
        }
    });

    // Função principal para renderizar os filmes
    async function renderMovies() {
        const carouselTrack = document.querySelector('.carousel-track');
        const movieGridContainer = document.querySelector('.movie-grid-container');
        const leftArrow = document.querySelector('.left-arrow');
        const rightArrow = document.querySelector('.right-arrow');

        // Verifica se os elementos essenciais existem antes de prosseguir
        if (!carouselTrack || !movieGridContainer || !leftArrow || !rightArrow) {
            console.warn('Um ou mais elementos do carrossel ou da grade não foram encontrados. Certifique-se de que o HTML está correto.');
            // Tentar renderizar o que for possível ou sair
            if (!carouselTrack) {
                // Se o carrossel não existe, pode esconder as setas para evitar erros
                if (leftArrow) leftArrow.style.display = 'none';
                if (rightArrow) rightArrow.style.display = 'none';
            }
            // Se nem o carouselTrack nem o movieGridContainer existem, então não há onde renderizar, então saia.
            if (!carouselTrack && !movieGridContainer) return;
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
            // Se não carregou os dados, não há o que renderizar.
            return;
        }

        // Limpa contêineres antes de adicionar novos elementos (caso haja conteúdo anterior)
        if (carouselTrack) carouselTrack.innerHTML = '';
        if (movieGridContainer) movieGridContainer.innerHTML = '';

        // Filtra filmes usando o array 'sections'
        const carouselMovies = moviesData.filter(movie => movie.sections && movie.sections.includes('lancamento'));
        const gridMovies = moviesData.filter(movie => movie.sections && movie.sections.includes('filme'));

        // Renderiza filmes no Carrossel (com duplicação para efeito infinito)
        if (carouselTrack && carouselMovies.length > 0) {
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
        } else if (carouselTrack) {
             // Esconde as setas se não houver filmes no carrossel ou o carouselTrack não existe
            if (leftArrow) leftArrow.style.display = 'none';
            if (rightArrow) rightArrow.style.display = 'none';
        }

        // Renderiza filmes na Grade
        if (movieGridContainer && gridMovies.length > 0) {
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
        const movieCards = carouselTrack ? carouselTrack.querySelectorAll('.movie-card') : [];

        if (movieCards.length === 0 || !leftArrow || !rightArrow || !carouselTrack) {
            return;
        }

        const firstMovieCard = movieCards[0];
        const computedStyle = getComputedStyle(firstMovieCard);
        const itemWidth = firstMovieCard.offsetWidth + parseFloat(computedStyle.marginRight || 0);

        if (itemWidth === 0) return;

        const originalTrackWidth = itemWidth * numOriginalItems;

        carouselTrack.scrollLeft = originalTrackWidth;

        let isScrolling = false;

        function handleInfiniteScroll() {
            if (isScrolling) return;

            // Ajuste para evitar rolagem além dos limites antes do "teleporte"
            const scrollThreshold = 5; // Pequena margem de erro

            if (carouselTrack.scrollLeft >= originalTrackWidth * 2 - carouselTrack.clientWidth - scrollThreshold) {
                isScrolling = true;
                carouselTrack.scrollLeft = originalTrackWidth;
            }
            else if (carouselTrack.scrollLeft <= scrollThreshold) {
                isScrolling = true;
                carouselTrack.scrollLeft = originalTrackWidth;
            }
            setTimeout(() => { isScrolling = false; }, 50);
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

    // Chama a função para renderizar os filmes quando o DOM estiver completamente carregado
    renderMovies();
});