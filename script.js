document.addEventListener('DOMContentLoaded', function() {
    const menuToggleButton = document.getElementById('menuToggleButton');
    const mainNavigation = document.getElementById('mainNavigation');

    if (menuToggleButton && mainNavigation) {
        menuToggleButton.addEventListener('click', function() {
            mainNavigation.classList.toggle('active'); // Adiciona/remove a classe 'active' para mostrar/ocultar o menu
        });

        // Fechar o menu mobile ao redimensionar para desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 769) { // Se a tela for desktop
                mainNavigation.classList.remove('active'); // Garante que o menu esteja oculto (sem a classe active)
            }
        });
    }
});