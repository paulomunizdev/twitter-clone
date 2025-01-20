document.addEventListener('DOMContentLoaded', function() {
    // Seleciona apenas o badge VIP
    const vipBadge = document.querySelector('.vip-badge');
    const verifiedBadge = document.querySelector('.verified-badge-vip');

    // Função para criar brilho na borda
    function createBorderGlow(element) {
        // Adiciona uma classe para o efeito de brilho
        element.classList.add('glow-effect');
        
        // Remove a classe após a animação
        setTimeout(() => {
            element.classList.remove('glow-effect');
        }, 2000);
    }

    if (vipBadge) {
        // Eventos do mouse para o badge VIP
        vipBadge.addEventListener('mouseenter', function() {
            createBorderGlow(this);
        });

        // Animação periódica sutil
        setInterval(() => {
            createBorderGlow(vipBadge);
        }, 5000);
    }

    // Eventos para o badge verificado
    if (verifiedBadge) {
        verifiedBadge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });

        verifiedBadge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // Adiciona os estilos necessários
    const style = document.createElement('style');
    style.textContent = `
        .vip-badge {
            transition: all 0.3s ease;
            position: relative;
        }

        .vip-badge.glow-effect {
            animation: borderPulse 2s ease-in-out;
        }

        @keyframes borderPulse {
            0% {
                box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4);
            }
            70% {
                box-shadow: 0 0 0 5px rgba(255, 215, 0, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
            }
        }

        .verified-badge-vip {
            transition: transform 0.3s ease;
        }
    `;

    document.head.appendChild(style);
});