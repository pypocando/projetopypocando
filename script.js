document.addEventListener('DOMContentLoaded', function() {
    const menuToggleButton = document.getElementById('menuToggleButton');
    const mainNavigation = document.getElementById('mainNavigation');

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

    // Lógica para o Carrossel de Filmes Infinito
    const carouselTrack = document.querySelector('.carousel-track');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const movieCards = document.querySelectorAll('.movie-card');

    if (carouselTrack && leftArrow && rightArrow && movieCards.length > 0) {
        const numOriginalItems = movieCards.length / 2; // Considerando que você duplicou os itens
        const firstOriginalItem = movieCards[0];
        let itemWidth = firstOriginalItem.offsetWidth + parseFloat(getComputedStyle(firstOriginalItem).marginRight);

        // Define a largura total de um "bloco" de itens originais
        const originalTrackWidth = itemWidth * numOriginalItems;

        // Inicializa a posição de rolagem para o início do segundo conjunto de itens (o "original")
        // Isso permite rolar para a esquerda ou direita a partir do "meio" do carrossel visualmente.
        carouselTrack.scrollLeft = originalTrackWidth;

        // Função para ajustar a rolagem para o efeito infinito
        function handleInfiniteScroll() {
            // Se rolou para a "parte duplicada" final, salta de volta para o início da parte original
            if (carouselTrack.scrollLeft >= originalTrackWidth * 2 - carouselTrack.clientWidth) {
                carouselTrack.scrollLeft = originalTrackWidth;
            }
            // Se rolou para a "parte duplicada" inicial, salta para o final da parte original
            else if (carouselTrack.scrollLeft <= 0) {
                carouselTrack.scrollLeft = originalTrackWidth;
            }
        }

        // Event Listeners para as setas
        leftArrow.addEventListener('click', () => {
            carouselTrack.scrollBy({
                left: -itemWidth * 2, // Rola por 2 itens para uma transição mais perceptível
                behavior: 'smooth'
            });
        });

        rightArrow.addEventListener('click', () => {
            carouselTrack.scrollBy({
                left: itemWidth * 2, // Rola por 2 itens
                behavior: 'smooth'
            });
        });

        // Event Listener para a rolagem manual (drag/swipe)
        carouselTrack.addEventListener('scroll', handleInfiniteScroll);

        // Opcional: Ações para desabilitar as setas quando não há mais para rolar no contexto de um loop
        // Para um carrossel verdadeiramente infinito, as setas nunca seriam desabilitadas,
        // mas você pode querer ajustar a opacidade para feedback visual.
        // Neste modelo infinito, as setas estarão sempre ativas.
    }
});