document.addEventListener('DOMContentLoaded', function() {
    const menuToggleButton = document.getElementById('menuToggleButton');
    const mainNavigation = document.getElementById('mainNavigation'); // Referência à nova navegação principal
    const contentWrapper = document.getElementById('contentWrapper'); // Mantido para futuras expansões, se necessário

    // Lógica para o botão de menu hambúrguer (agora para a navegação superior)
    if (menuToggleButton && mainNavigation) {
        menuToggleButton.addEventListener('click', function() {
            mainNavigation.classList.toggle('active'); // Adiciona/remove a classe 'active' na navegação
        });

        // Fechar a navegação ao redimensionar para desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 769) { // Se a tela for desktop
                mainNavigation.classList.remove('active'); // Garante que o menu não fique "ativo" (aberto)
            }
        });
    }

    // Lógica para o Carrossel de Filmes
    const carouselTrack = document.querySelector('.carousel-track');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    if (carouselTrack && leftArrow && rightArrow) {
        const scrollAmount = 200; // Quantidade de pixels para rolar por clique

        leftArrow.addEventListener('click', () => {
            carouselTrack.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        rightArrow.addEventListener('click', () => {
            carouselTrack.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Opcional: Ocultar/mostrar setas se não houver mais para rolar
        // Pode ser implementado se desejar feedback visual mais sofisticado
        // Exemplo básico:
        carouselTrack.addEventListener('scroll', () => {
            if (carouselTrack.scrollLeft === 0) {
                leftArrow.style.opacity = '0.5'; // Quase transparente
                leftArrow.style.pointerEvents = 'none'; // Desabilita clique
            } else {
                leftArrow.style.opacity = '1';
                leftArrow.style.pointerEvents = 'auto';
            }

            // Verifica se chegou ao fim (com uma pequena margem de erro)
            if (carouselTrack.scrollWidth - carouselTrack.scrollLeft <= carouselTrack.clientWidth + 5) {
                rightArrow.style.opacity = '0.5';
                rightArrow.style.pointerEvents = 'none';
            } else {
                rightArrow.style.opacity = '1';
                rightArrow.style.pointerEvents = 'auto';
            }
        });

        // Dispara o evento de scroll uma vez para definir o estado inicial das setas
        carouselTrack.dispatchEvent(new Event('scroll'));
    }
});