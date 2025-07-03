document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const contentWrapper = document.getElementById('contentWrapper');
    const menuToggleButton = document.getElementById('menuToggleButton');
    const sidebarCloseButton = document.getElementById('sidebarCloseButton');

    // Função para abrir a sidebar
    function openSidebar() {
        sidebar.classList.add('open');
        document.body.classList.add('menu-open');
        menuToggleButton.style.display = 'none'; // Esconde o ícone de 3 traços
        sidebarCloseButton.style.display = 'flex'; // Mostra o ícone de fechar (X)
    }

    // Função para fechar a sidebar
    function closeSidebar() {
        sidebar.classList.remove('open');
        document.body.classList.remove('menu-open');
        // A lógica de exibição do menuToggleButton será tratada por CSS @media query ou aqui se necessário
        if (window.innerWidth <= 768) { // Se for mobile
            menuToggleButton.style.display = 'flex'; // Mostra o ícone de 3 traços novamente
        } else { // Se for desktop
            menuToggleButton.style.display = 'flex'; // Sempre visível no desktop
        }
        sidebarCloseButton.style.display = 'none'; // Esconde o ícone de fechar (X)
    }

    // Event Listeners
    menuToggleButton.addEventListener('click', openSidebar);
    sidebarCloseButton.addEventListener('click', closeSidebar);

    // Fechar sidebar ao clicar fora dela (apenas em desktop)
    contentWrapper.addEventListener('click', (event) => {
        // Verifica se a sidebar está aberta e se o clique foi fora dela e não no botão de menu
        if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && event.target !== menuToggleButton && !menuToggleButton.contains(event.target)) {
            closeSidebar();
        }
    });

    // Lógica para esconder o botão de fechar da sidebar na inicialização em desktop (ele só é visível ao expandir)
    // E para mostrar/esconder o menuToggleButton corretamente dependendo da largura da tela
    function handleInitialState() {
        if (window.innerWidth > 768) { // Desktop
            sidebarCloseButton.style.display = 'none'; // Esconde o botão de fechar por padrão
            menuToggleButton.style.display = 'flex'; // Mostra o botão de 3 traços
            sidebar.classList.remove('open'); // Garante que a sidebar comece fechada
            document.body.classList.remove('menu-open'); // Garante que o blur não esteja ativo
        } else { // Mobile
            sidebarCloseButton.style.display = 'none'; // Esconde o botão de fechar por padrão em mobile, só aparece quando abre
            menuToggleButton.style.display = 'flex'; // Mostra o botão de 3 traços
            sidebar.classList.remove('open'); // Garante que a sidebar comece fechada
            document.body.classList.remove('menu-open'); // Garante que o blur não esteja ativo
        }
    }

    // Chama a função ao carregar a página e ao redimensionar
    handleInitialState();
    window.addEventListener('resize', handleInitialState);

    // Ajuste adicional para o comportamento dos botões em telas pequenas
    // O menuToggleButton é escondido no CSS por padrão em desktop, e mostrado em mobile via media query.
    // O sidebarCloseButton é escondido por padrão e só mostrado quando o menu é aberto via JS.
    // Esta parte do JS garante a transição correta da visibilidade dos botões.
    if (window.innerWidth <= 768) { // Mobile
        menuToggleButton.style.display = 'flex';
        sidebarCloseButton.style.display = 'none';
    } else { // Desktop
        menuToggleButton.style.display = 'flex'; // Sempre visível em desktop
        sidebarCloseButton.style.display = 'none';
    }
});