document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const body = document.body;
    const mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-overlay';
    body.appendChild(mobileOverlay);

    const notificationToggle = document.querySelector('.notification-toggle');
    const userMenuToggle = document.querySelector('.menu-toggle');
    const notificationMenu = document.querySelector('.notification-menu');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    // Função para fechar todos os menus
    function closeAllMenus() {
        if (notificationToggle) notificationToggle.checked = false;
        if (userMenuToggle) userMenuToggle.checked = false;
        mobileOverlay.classList.remove('active');
        body.classList.remove('menu-open');
    }

    // Função para fechar menu específico
    function closeMenu(toggle) {
        if (toggle) toggle.checked = false;
        handleMenuState(false);
    }

    // Gerenciar estado dos menus
    function handleMenuState(isOpen) {
        if (window.innerWidth <= 768) {
            if (isOpen) {
                mobileOverlay.classList.add('active');
                body.classList.add('menu-open');
            } else {
                mobileOverlay.classList.remove('active');
                body.classList.remove('menu-open');
            }
        }
    }

    // Event listeners para os toggles com comportamento mutuamente exclusivo
    if (notificationToggle) {
        notificationToggle.addEventListener('change', function() {
            if (this.checked) {
                // Se as notificações estão sendo abertas, fecha o menu do usuário
                closeMenu(userMenuToggle);
            }
            handleMenuState(this.checked);
        });
    }

    if (userMenuToggle) {
        userMenuToggle.addEventListener('change', function() {
            if (this.checked) {
                // Se o menu do usuário está sendo aberto, fecha as notificações
                closeMenu(notificationToggle);
            }
            handleMenuState(this.checked);
        });
    }

    // Fechar ao clicar no overlay
    mobileOverlay.addEventListener('click', closeAllMenus);

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeAllMenus();
    });

    // Detectar mudanças de orientação
    window.addEventListener('orientationchange', closeAllMenus);

    // Ajustar com base no tamanho da tela
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                closeAllMenus();
            }
        }, 250);
    });

    // Fechar ao rolar a página
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        if (Math.abs(lastScrollTop - st) > 50) {
            closeAllMenus();
        }
        lastScrollTop = st;
    }, false);

    // Prevenir scroll quando menu está aberto
    document.addEventListener('touchmove', function(e) {
        if (body.classList.contains('menu-open')) {
            e.preventDefault();
        }
    }, { passive: false });
});