document.addEventListener('DOMContentLoaded', () => {
    // Elementos que terão scrollbar VIP
    const scrollableElements = document.querySelectorAll('.notification-list, .main-content, .tweet-content, .dropdown-menu');

    class VIPScrollManager {
        constructor(element) {
            this.element = element;
            this.scrollTimer = null;
            this.isScrolling = false;
            this.lastScrollTop = 0;
            this.scrollDirection = null;
            
            this.init();
        }

        init() {
            // Configuração inicial
            this.element.classList.add('custom-scrollbar');
            this.setupScrollEffects();
            this.setupResizeObserver();
            this.setupSmoothScroll();
            this.checkOverflow();
        }

        setupScrollEffects() {
            // Efeito de scroll suave com física
            this.element.addEventListener('scroll', () => {
                this.handleScroll();
                this.updateScrollDirection();
                this.addScrollingClass();
            });

            // Efeito hover aprimorado
            this.element.addEventListener('mouseenter', () => {
                this.element.classList.add('hover');
            });

            this.element.addEventListener('mouseleave', () => {
                this.element.classList.remove('hover');
                if (!this.isScrolling) {
                    this.element.classList.remove('scrolling');
                }
            });
        }

        handleScroll() {
            // Atualiza estado de scroll
            this.isScrolling = true;
            clearTimeout(this.scrollTimer);

            this.scrollTimer = setTimeout(() => {
                this.isScrolling = false;
                if (!this.element.matches(':hover')) {
                    this.element.classList.remove('scrolling');
                }
            }, 150); // Tempo reduzido para resposta mais rápida
        }

        updateScrollDirection() {
            const st = this.element.scrollTop;
            
            if (st > this.lastScrollTop) {
                this.element.classList.remove('scroll-up');
                this.element.classList.add('scroll-down');
            } else if (st < this.lastScrollTop) {
                this.element.classList.remove('scroll-down');
                this.element.classList.add('scroll-up');
            }
            
            this.lastScrollTop = st;
        }

        addScrollingClass() {
            if (!this.element.classList.contains('scrolling')) {
                this.element.classList.add('scrolling');
            }
        }

        setupResizeObserver() {
            // Observa mudanças no tamanho do conteúdo
            const resizeObserver = new ResizeObserver(() => {
                this.checkOverflow();
            });

            resizeObserver.observe(this.element);
        }

        checkOverflow() {
            // Verifica se precisa de scrollbar
            const hasOverflow = this.element.scrollHeight > this.element.clientHeight;
            this.element.classList.toggle('has-scroll', hasOverflow);
        }

        setupSmoothScroll() {
            // Scroll suave para links internos
            this.element.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = anchor.getAttribute('href');
                    const targetElement = this.element.querySelector(targetId);

                    if (targetElement) {
                        const offset = targetElement.offsetTop - this.element.offsetTop;
                        this.smoothScrollTo(offset);
                    }
                });
            });
        }

        smoothScrollTo(targetPosition) {
            // Animação de scroll suave customizada
            const startPosition = this.element.scrollTop;
            const distance = targetPosition - startPosition;
            const duration = 800;
            let startTime = null;

            const animation = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);

                // Função de easing para movimento mais natural
                const easeInOutQuart = t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
                
                const position = startPosition + distance * easeInOutQuart(progress);
                this.element.scrollTop = position;

                if (progress < 1) {
                    requestAnimationFrame(animation);
                }
            };

            requestAnimationFrame(animation);
        }
    }

    // Inicializa para todos os elementos
    scrollableElements.forEach(element => {
        new VIPScrollManager(element);
    });
});