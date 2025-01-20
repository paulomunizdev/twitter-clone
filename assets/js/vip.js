document.addEventListener('DOMContentLoaded', () => {
    // Animação do header VIP
    const vipHeader = document.querySelector('.vip-header');
    if (vipHeader) {
        vipHeader.style.opacity = '0';
        vipHeader.style.transform = 'translateY(20px)';
        vipHeader.style.transition = 'all 0.6s ease-out';
        
        setTimeout(() => {
            vipHeader.style.opacity = '1';
            vipHeader.style.transform = 'translateY(0)';
        }, 300);
    }

    // Animação sequencial dos benefícios
    const benefits = document.querySelectorAll('.benefit-item');
    benefits.forEach((benefit, index) => {
        benefit.style.opacity = '0';
        benefit.style.transform = 'translateX(-20px)';
        benefit.style.transition = 'all 0.4s ease-out';

        setTimeout(() => {
            benefit.style.opacity = '1';
            benefit.style.transform = 'translateX(0)';
        }, 500 + (index * 200)); // Delay crescente para cada item
    });

    // Animação do preview do perfil
    const previewTweet = document.querySelector('.preview-tweet');
    if (previewTweet) {
        previewTweet.style.opacity = '0';
        previewTweet.style.transform = 'scale(0.95)';
        previewTweet.style.transition = 'all 0.5s ease-out';

        setTimeout(() => {
            previewTweet.style.opacity = '1';
            previewTweet.style.transform = 'scale(1)';
        }, 1000);
    }

    // Efeito de brilho no botão de assinatura
    const subscribeButton = document.querySelector('.subscribe-button');
    if (subscribeButton) {
        subscribeButton.addEventListener('mousemove', (e) => {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            subscribeButton.style.background = `
                radial-gradient(circle at ${x}px ${y}px, 
                rgba(255, 215, 0, 0.8) 0%, 
                rgba(218, 165, 32, 1) 50%
                )
            `;
        });

        subscribeButton.addEventListener('mouseleave', () => {
            subscribeButton.style.background = 'var(--vip-gradient)';
        });
    }

    // Efeito de flutuação suave para o badge VIP
    const vipBadge = document.querySelector('.vip-badge-large');
    if (vipBadge) {
        let floatUp = true;
        setInterval(() => {
            if (floatUp) {
                vipBadge.style.transform = 'translateY(-3px)';
            } else {
                vipBadge.style.transform = 'translateY(0)';
            }
            floatUp = !floatUp;
        }, 1500);
    }

    // Efeito de destaque nos benefícios ao hover
    benefits.forEach(benefit => {
        benefit.addEventListener('mouseenter', () => {
            const icon = benefit.querySelector('.benefit-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });

        benefit.addEventListener('mouseleave', () => {
            const icon = benefit.querySelector('.benefit-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
        });
    });

    // Animação do preço
    const priceBox = document.querySelector('.price-box');
    if (priceBox) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    priceBox.style.animation = 'pulse 2s infinite';
                    priceBox.style.transform = 'scale(1)';
                    observer.unobserve(priceBox);
                }
            });
        });

        observer.observe(priceBox);
    }
});

// Adicione os keyframes necessários ao CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);