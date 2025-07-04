document.addEventListener('DOMContentLoaded', function() {
    const menuToggleButton = document.getElementById('menuToggleButton');
    const mainNavigation = document.getElementById('mainNavigation');
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const movieDetailsModal = document.getElementById('movieDetailsModal');
    const closeButton = document.querySelector('.close-button');

    let allMoviesData = []; // Variável para armazenar todos os filmes carregados

    // Lógica para o botão de menu hambúrguer
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

    // Função auxiliar para criar um movie-card (AGORA CLICÁVEL)
    function createMovieCard(movie) {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.dataset.movieId = movie.id; // Adiciona um data-attribute com o ID do filme

        const img = document.createElement('img');
        img.src = movie.coverUrl;
        img.alt = `Pôster do Filme ${movie.title}`;
        img.loading = 'lazy'; // Otimização para carregamento de imagens

        const p = document.createElement('p');
        p.textContent = movie.title;

        movieCard.appendChild(img);
        movieCard.appendChild(p);

        // Adiciona o event listener para clique no movie-card
        movieCard.addEventListener('click', () => showMovieDetails(movie.id));

        return movieCard;
    }

    // Função principal para renderizar os filmes (busca os dados)
    async function renderMovies() {
        const carouselTrack = document.querySelector('.carousel-track');
        const movieGridContainer = document.querySelector('.movie-grid-container');
        const leftArrow = document.querySelector('.left-arrow');
        const rightArrow = document.querySelector('.right-arrow');

        // Verificação inicial dos elementos (útil para depuração)
        if (!carouselTrack || !movieGridContainer || !leftArrow || !rightArrow) {
            console.error('Um ou mais elementos de contêiner ou seta não foram encontrados. Carrossel ou grade de filmes não serão exibidos corretamente.');
        }

        try {
            const response = await fetch('data/movies.json'); // Caminho para seu arquivo de dados
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allMoviesData = await response.json(); // Armazena todos os dados dos filmes
            displayFilteredMovies(allMoviesData); // Exibe todos os filmes inicialmente
        } catch (error) {
            console.error('Erro ao carregar os dados dos filmes:', error);
            return; // Impede a continuação se os dados não puderem ser carregados
        }
    }

    // Função para exibir filmes na grade e carrossel, com base em uma lista filtrada
    function displayFilteredMovies(moviesToDisplay) {
        const carouselTrack = document.querySelector('.carousel-track');
        const movieGridContainer = document.querySelector('.movie-grid-container');
        const leftArrow = document.querySelector('.left-arrow');
        const rightArrow = document.querySelector('.right-arrow');

        // Limpa os contêineres antes de adicionar novos elementos
        if (carouselTrack) carouselTrack.innerHTML = '';
        if (movieGridContainer) movieGridContainer.innerHTML = '';

        // Filtra filmes para carrossel (seção 'lancamento') e grade (seção 'filme')
        const carouselMovies = moviesToDisplay.filter(movie => movie.sections && movie.sections.includes('lancamento'));
        const gridMovies = moviesToDisplay.filter(movie => movie.sections && movie.sections.includes('filme'));

        // Renderiza filmes no Carrossel (com duplicação para efeito infinito)
        if (carouselMovies.length > 0 && carouselTrack && leftArrow && rightArrow) {
            // Adiciona 3 vezes para o efeito de rolagem infinita
            carouselMovies.forEach(movie => {
                carouselTrack.appendChild(createMovieCard(movie));
            });
            carouselMovies.forEach(movie => {
                carouselTrack.appendChild(createMovieCard(movie));
            });
            carouselMovies.forEach(movie => {
                carouselTrack.appendChild(createMovieCard(movie));
            });
            initializeCarousel(carouselMovies.length); // Inicializa a lógica de rolagem
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
        
        // Verificação de existência dos elementos para inicialização
        if (!carouselTrack || !leftArrow || !rightArrow) {
            console.error('Elementos do carrossel (track ou setas) não encontrados para inicialização.');
            return;
        }

        const movieCards = carouselTrack.querySelectorAll('.movie-card');

        if (movieCards.length === 0) return;

        const firstMovieCard = movieCards[0];
        const computedStyle = getComputedStyle(firstMovieCard);
        // Calcula a largura do item incluindo a margem
        const itemWidth = firstMovieCard.offsetWidth + parseFloat(computedStyle.marginRight);

        // Calcula a largura total da parte original do carrossel
        const originalTrackWidth = itemWidth * numOriginalItems;
        carouselTrack.scrollLeft = originalTrackWidth; // Posiciona no início da segunda cópia

        let isScrolling = false; // Flag para evitar múltiplas chamadas de rolagem

        function handleInfiniteScroll() {
            if (isScrolling) return; // Se já estiver rolando, ignora

            // Se rolou para o final da segunda cópia, volta para o início da primeira cópia
            if (carouselTrack.scrollLeft >= originalTrackWidth * 2 - carouselTrack.clientWidth - 5) { // Pequena margem de erro
                isScrolling = true;
                carouselTrack.scrollLeft = originalTrackWidth;
            }
            // Se rolou para o início da primeira cópia, volta para o final da segunda cópia
            else if (carouselTrack.scrollLeft <= 5) { // Pequena margem de erro para o limite esquerdo
                isScrolling = true;
                carouselTrack.scrollLeft = originalTrackWidth;
            }
            // Reseta a flag após um pequeno timeout para permitir novas rolagem
            setTimeout(() => { isScrolling = false; }, 50); // Ajuste o tempo se necessário
        }

        // Remover os listeners antigos antes de adicionar novos é uma boa prática
        // para evitar duplicação caso a função initializeCarousel seja chamada múltiplas vezes (ex: por resize)
        carouselTrack.removeEventListener('scroll', handleInfiniteScroll);
        leftArrow.removeEventListener('click', scrollLeft);
        rightArrow.removeEventListener('click', scrollRight);

        // Adiciona novos listeners
        carouselTrack.addEventListener('scroll', handleInfiniteScroll);
        leftArrow.addEventListener('click', scrollLeft);
        rightArrow.addEventListener('click', scrollRight);

        // Funções de rolagem das setas
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

    // Lógica de pesquisa
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase(); // Converte para minúsculas para pesquisa sem distinção de maiúsculas/minúsculas
        let filteredMovies = [];

        if (searchTerm.trim() === '') {
            // Se a pesquisa estiver vazia, exibe todos os filmes
            filteredMovies = allMoviesData;
        } else {
            // Filtra os filmes por título (você pode adicionar outras propriedades, como categoria)
            filteredMovies = allMoviesData.filter(movie =>
                movie.title.toLowerCase().includes(searchTerm) ||
                (movie.category && movie.category.toLowerCase().includes(searchTerm)) // Inclui pesquisa por categoria
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

    // --- Lógica do Modal (Pop-up de Detalhes do Filme) ---

    // Função para exibir os detalhes do filme no modal
    function showMovieDetails(movieId) {
        const movie = allMoviesData.find(m => m.id === movieId); // Encontra o filme pelo ID
        if (!movie) {
            console.error('Filme não encontrado para o ID:', movieId);
            return;
        }

        // Preenche o conteúdo do modal com os dados do filme
        document.getElementById('modalMovieCover').src = movie.coverUrl;
        document.getElementById('modalMovieCover').alt = `Capa do Filme ${movie.title}`;
        document.getElementById('modalMovieTitle').textContent = movie.title;
        document.getElementById('modalMovieCategory').textContent = `Categoria: ${movie.category || 'N/A'}`;
        document.getElementById('modalMovieReleaseDate').textContent = `Lançamento: ${movie.releaseDate || 'N/A'}`;

        movieDetailsModal.classList.add('active'); // Adiciona a classe 'active' para exibir o modal (CSS controlará o display)
    }

    // Função para fechar o modal
    function closeMovieDetails() {
        if (movieDetailsModal) {
            movieDetailsModal.classList.remove('active'); // Remove a classe 'active' para esconder o modal
        }
    }

    // Event listeners para fechar o modal (botão X e clique fora)
    if (closeButton) {
        closeButton.addEventListener('click', closeMovieDetails);
    }

    // Fecha o modal se o clique ocorrer fora do conteúdo do modal
    if (movieDetailsModal) {
        window.addEventListener('click', function(event) {
            if (event.target === movieDetailsModal) {
                closeMovieDetails();
            }
        });
    }
    // --- Fim da lógica do Modal ---

    renderMovies(); // Chama a função para renderizar os filmes quando o DOM estiver completamente carregado
});