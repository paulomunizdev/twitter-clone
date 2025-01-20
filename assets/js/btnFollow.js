document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os elementos do botão Follow
    const followBtns = document.querySelectorAll('.follow-btn');
    const followToggles = document.querySelectorAll('.follow-toggle');

    // Função para criar explosão de partículas
    function createParticleExplosion(element, type = 'follow') {
        const colors = type === 'follow' 
            ? ['#FFD700', '#FFA500', '#DAA520', '#F0E68C'] // Cores douradas para follow
            : ['#FF69B4', '#FF1493', '#DB7093', '#FFB6C1']; // Cores rosa para unfollow
        
        const particleCount = 24; // Número de partículas
        const centerX = element.offsetWidth / 2;
        const centerY = element.offsetHeight / 2;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${type}-particle`;
            
            const angle = (i * (360 / particleCount)) * (Math.PI / 180);
            const velocity = 3 + Math.random() * 2;
            const size = 6 + Math.random() * 8;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const delay = Math.random() * 0.2;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${centerX}px;
                top: ${centerY}px;
                box-shadow: 0 0 ${size * 2}px ${color};
                opacity: 0;
                transform: translate(-50%, -50%);
                animation: particleExplosion 1s ease-out ${delay}s;
                --angle: ${angle};
                --velocity: ${velocity};
            `;
            
            element.appendChild(particle);
            setTimeout(() => particle.remove(), 1500);
        }
    }

    // Função para criar ondas de energia
    function createEnergyWave(element, type = 'follow') {
        const waves = 3;
        const baseColor = type === 'follow' ? '#FFD700' : '#FF69B4';
        
        for (let i = 0; i < waves; i++) {
            const wave = document.createElement('div');
            wave.className = `energy-wave ${type}-wave`;
            
            wave.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                height: 100%;
                border: 4px solid ${baseColor};
                border-radius: 9999px;
                transform: translate(-50%, -50%) scale(0.8);
                opacity: 0.8;
                animation: energyWaveExpand 1s ease-out ${i * 0.2}s;
                box-shadow: 0 0 20px ${baseColor},
                           inset 0 0 20px ${baseColor};
                pointer-events: none;
                z-index: -1;
            `;
            
            element.appendChild(wave);
            setTimeout(() => wave.remove(), 1200 + (i * 200));
        }
    }

    // Configuração dos botões
    followToggles.forEach((toggle, index) => {
        const btn = followBtns[index];
        if (!btn) return;

        // Evento de mudança de estado (Follow/Unfollow)
        toggle.addEventListener('change', function() {
            const isFollowing = this.checked;
            
            if (isFollowing) {
                createParticleExplosion(btn, 'follow');
                createEnergyWave(btn, 'follow');
                btn.style.animation = 'followPulseEnhanced 0.6s cubic-bezier(0.11, 0, 0.5, 0)';
            } else {
                createParticleExplosion(btn, 'unfollow');
                createEnergyWave(btn, 'unfollow');
                btn.style.animation = 'unfollowShakeEnhanced 0.6s ease';
            }
            
            setTimeout(() => {
                btn.style.animation = '';
            }, 600);
        });

        // Efeitos de hover
        btn.addEventListener('mouseenter', function() {
            const isFollowing = toggle.checked;
            if (!isFollowing) {
                this.style.transform = 'translateY(-4px) scale(1.08)';
                this.style.boxShadow = `
                    0 6px 20px rgba(218,165,32,0.4),
                    0 0 15px rgba(255,215,0,0.4),
                    inset 0 0 10px rgba(255,215,0,0.2)
                `;
            } else {
                this.style.transform = 'translateY(-2px) scale(1.05)';
                this.style.boxShadow = `
                    0 4px 15px rgba(255,105,180,0.4),
                    0 0 10px rgba(255,20,147,0.4),
                    inset 0 0 8px rgba(255,20,147,0.2)
                `;
            }
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // Adiciona os estilos das animações
    const style = document.createElement('style');
    style.textContent = `
        .follow-btn {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
        }

        @keyframes particleExplosion {
            0% {
                transform: translate(-50%, -50%) scale(0.2);
                opacity: 0;
            }
            20% {
                opacity: 1;
            }
            100% {
                transform: translate(
                    calc(cos(var(--angle)) * (var(--velocity) * 100px)),
                    calc(sin(var(--angle)) * (var(--velocity) * 100px))
                ) scale(0);
                opacity: 0;
            }
        }

        @keyframes energyWaveExpand {
            0% {
                transform: translate(-50%, -50%) scale(0.8);
                opacity: 0.8;
            }
            100% {
                transform: translate(-50%, -50%) scale(2.5);
                opacity: 0;
            }
        }

        @keyframes followPulseEnhanced {
            0% { transform: scale(1); }
            50% { transform: scale(1.15); }
            75% { transform: scale(0.95); }
            100% { transform: scale(1); }
        }

        @keyframes unfollowShakeEnhanced {
            0%, 100% { transform: translateX(0) scale(1); }
            20% { transform: translateX(-4px) scale(1.05); }
            40% { transform: translateX(4px) scale(1.05); }
            60% { transform: translateX(-2px) scale(1.02); }
            80% { transform: translateX(2px) scale(1.02); }
        }

        .follow-particle {
            filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8));
        }

        .unfollow-particle {
            filter: drop-shadow(0 0 8px rgba(255, 105, 180, 0.8));
        }
    `;

    document.head.appendChild(style);
});