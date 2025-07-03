document.addEventListener('DOMContentLoaded', function() {
    const menuToggleButton = document.getElementById('menuToggleButton');
    const sidebar = document.getElementById('sidebar');
    const contentWrapper = document.getElementById('contentWrapper');
    const closeSidebarButton = document.getElementById('closeSidebarButton'); // Novo botão de fechar

    if (menuToggleButton && sidebar && contentWrapper) {
        menuToggleButton.addEventListener('click', function() {
            sidebar.classList.toggle('active'); // Adiciona/remove a classe 'active' na sidebar
            // No desktop, não precisamos empurrar com margin-left, o grid cuida disso.
            // Para mobile, o 'sidebar-open' ainda é útil para o empurrão do conteúdo.
            if (window.innerWidth <= 768) { 
                contentWrapper.classList.toggle('sidebar-open'); 
            }
        });

        // Event listener para o novo botão de fechar
        if (closeSidebarButton) {
            closeSidebarButton.addEventListener('click', function() {
                sidebar.classList.remove('active');
                if (window.innerWidth <= 768) {
                    contentWrapper.classList.remove('sidebar-open');
                }
            });
        }
        

        // Opcional: Fechar a sidebar ao clicar fora dela ou em um link
        // Esta parte pode ser ajustada ou removida dependendo do comportamento desejado
        contentWrapper.addEventListener('click', function(event) {
            // Se a sidebar estiver aberta E o clique não foi no botão de alternância nem na própria sidebar
            if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && !menuToggleButton.contains(event.target)) {
                sidebar.classList.remove('active');
                if (window.innerWidth <= 768) {
                    contentWrapper.classList.remove('sidebar-open');
                }
            }
        });

        // Fechar sidebar e redefinir layout ao redimensionar a janela para desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 769) { // Se a tela for desktop
                sidebar.classList.remove('active'); // Garante que a sidebar não fique "ativa" (aberta)
                contentWrapper.classList.remove('sidebar-open'); // Remove o push do conteúdo (relevante apenas para mobile)
                sidebar.style.width = '60px'; // Garante a largura de 60px no desktop
            } else { // Se a tela for mobile
                // Reseta a largura da sidebar se ela foi alterada por JS no desktop para expansão
                // (Isso é para o caso de ter um comportamento de expansão no desktop que não queremos no mobile)
                sidebar.style.width = ''; // Remove o estilo inline de largura
            }
        });
    }
});