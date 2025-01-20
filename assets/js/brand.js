document.addEventListener('DOMContentLoaded', () => {
    // Get the brand logo elements
    const brandLink = document.querySelector('.brand');
    const logoSVG = document.querySelector('.nav-logo');
    const logoPath = logoSVG.querySelector('path');

    // VIP color definitions
    const colors = {
        gold: '#FFD700',
        goldDark: '#DAA520',
        gradientStart: '#FFD700',
        gradientEnd: '#FFA500'
    };

    // Create and append gradient definitions to SVG
    const svgNS = "http://www.w3.org/2000/svg";
    const defs = document.createElementNS(svgNS, "defs");
    
    // Create gradient element
    const gradient = document.createElementNS(svgNS, "linearGradient");
    gradient.setAttribute("id", "vipGradient");
    gradient.setAttribute("gradientUnits", "userSpaceOnUse");
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "100%");
    gradient.setAttribute("y2", "100%");

    // Create gradient stops
    const stop1 = document.createElementNS(svgNS, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", colors.gradientStart);

    const stop2 = document.createElementNS(svgNS, "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", colors.gradientEnd);

    // Append elements
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    logoSVG.insertBefore(defs, logoSVG.firstChild);

    let isAnimating = false;
    let currentRotation = 0;

    // Subtle scale animation function
    function animateScale(element, startScale, endScale, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smooth easing function
            const easeOutQuad = t => t * (2 - t);
            
            const currentScale = startScale + (endScale - startScale) * easeOutQuad(progress);
            element.style.transform = `scale(${currentScale})`;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                isAnimating = false;
            }
        }
        
        requestAnimationFrame(update);
    }

    // Add subtle floating animation
    let floatingAngle = 0;
    function floatingAnimation() {
        floatingAngle += 0.015;
        const yOffset = Math.sin(floatingAngle) * 1.5; // Muito sutil
        
        if (!isAnimating) {
            logoSVG.style.transform = `translateY(${yOffset}px)`;
        }
        
        requestAnimationFrame(floatingAnimation);
    }

    // Mouse enter event
    brandLink.addEventListener('mouseenter', () => {
        if (isAnimating) return;
        isAnimating = true;

        // Apply gradient fill
        logoPath.style.transition = 'fill 0.4s ease-out';
        logoPath.style.fill = 'url(#vipGradient)';

        // Add shimmer effect
        logoSVG.style.filter = 'drop-shadow(0 2px 4px rgba(218,165,32,0.3))';
        
        // Gentle scale up
        animateScale(logoSVG, 1, 1.05, 400);
    });

    // Mouse leave event
    brandLink.addEventListener('mouseleave', () => {
        if (isAnimating) return;
        isAnimating = true;

        // Reset to solid gold color
        logoPath.style.fill = colors.gold;
        
        // Remove shimmer
        logoSVG.style.filter = 'none';
        
        // Gentle scale down
        animateScale(logoSVG, 1.05, 1, 400);
    });

    // Initialize color
    logoPath.style.fill = colors.gold;

    // Start floating animation
    floatingAnimation();

    // Adiciona efeito de brilho suave
    let shimmerAngle = 0;
    function updateShimmer() {
        shimmerAngle += 0.02;
        const shimmerIntensity = Math.sin(shimmerAngle) * 0.15 + 0.85;
        
        if (!isAnimating) {
            stop1.setAttribute("stop-color", colors.gradientStart);
            stop2.setAttribute("stop-color", colors.gradientEnd);
            gradient.setAttribute("gradientTransform", `rotate(${135 + Math.sin(shimmerAngle) * 5})`);
        }
        
        requestAnimationFrame(updateShimmer);
    }
    updateShimmer();
});