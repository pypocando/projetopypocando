document.addEventListener('DOMContentLoaded', function() {
    const menuToggleButton = document.getElementById('menuToggleButton');
    const sidebar = document.getElementById('sidebar');
    const contentWrapper = document.getElementById('contentWrapper');

    if (menuToggleButton && sidebar && contentWrapper) {
        menuToggleButton.addEventListener('click', function() {
            sidebar.classList.toggle('active'); // Adiciona/remove a classe 'active' na sidebar
            contentWrapper.classList.toggle('sidebar-open'); // Adiciona/remove a classe 'sidebar-open' no content-wrapper
        });

        // Opcional: Fechar a sidebar ao clicar fora dela ou em um link
        // Esta parte pode ser ajustada ou removida dependendo do comportamento desejado
        contentWrapper.addEventListener('click', function(event) {
            // Se a sidebar estiver aberta E o clique não foi no botão de alternância nem na própria sidebar
            if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && !menuToggleButton.contains(event.target)) {
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
});