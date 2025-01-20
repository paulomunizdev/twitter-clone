// boost-post.js

document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    setupEventListeners();
    initializeBudgetCalculator();
});

// Animation initialization
function initializeAnimations() {
    const boostOptions = document.querySelector('.boost-options');
    boostOptions.style.opacity = '0';
    boostOptions.style.transform = 'translateY(20px)';
    
    requestAnimationFrame(() => {
        boostOptions.style.transition = 'all 0.5s ease';
        boostOptions.style.opacity = '1';
        boostOptions.style.transform = 'translateY(0)';
    });

    animateStatsEntrance();
}

// Animate stats entrance with stagger effect
function animateStatsEntrance() {
    const stats = document.querySelectorAll('.reach-stat');
    stats.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            stat.style.transition = 'all 0.4s ease';
            stat.style.opacity = '1';
            stat.style.transform = 'translateX(0)';
        }, 100 * index);
    });
}

// Setup event listeners for interactive elements
function setupEventListeners() {
    const durationInputs = document.querySelectorAll('input[name="duration"]');
    durationInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const duration = e.target.value;
            const label = document.querySelector(`label[for="${e.target.id}"]`);
            animateDurationSelection(label);
            updateBudgetDisplay(duration);
            updateReachEstimates();
        });
    });

    const targetSelect = document.querySelector('.boost-select');
    targetSelect.addEventListener('change', () => {
        animateTargetSelection();
        updateReachEstimates();
    });

    const boostButton = document.querySelector('.btn-primary');
    boostButton.addEventListener('click', animateBoostButton);
}

// Animate boost button click with simple effect
function animateBoostButton(e) {
    const button = e.currentTarget;
    
    // Prevent multiple clicks
    if (button.disabled) return;
    button.disabled = true;

    // Simple scale effect
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        button.disabled = false;
    }, 200);
}

// Calculate boost price based on duration
function calculateBoostPrice(duration) {
    const prices = {
        '24': 0.000026,
        '48': 0.000052,
        '72': 0.000086
    };
    return prices[duration] || 0.000026;
}

// Update budget display based on selected duration
function updateBudgetDisplay(duration) {
    const budgetAmount = document.querySelector('.budget-amount');
    const price = calculateBoostPrice(duration);
    
    budgetAmount.style.transform = 'scale(1.05)';
    budgetAmount.textContent = `₿ ${price.toFixed(6)}`;
    
    setTimeout(() => {
        budgetAmount.style.transform = 'scale(1)';
    }, 200);
}

// Animate duration option selection
function animateDurationSelection(selectedOption) {
    if (!selectedOption) return;
    selectedOption.style.transform = 'scale(1.02)';
    setTimeout(() => {
        selectedOption.style.transform = 'scale(1)';
    }, 200);
}

// Animate target audience selection
function animateTargetSelection() {
    const select = document.querySelector('.boost-select');
    select.style.transform = 'scale(1.02)';
    setTimeout(() => {
        select.style.transform = 'scale(1)';
    }, 200);
}

// Initialize budget calculator
function initializeBudgetCalculator() {
    const initialDuration = document.querySelector('input[name="duration"]:checked').value;
    updateBudgetDisplay(initialDuration);
    
    const budgetDisplay = document.querySelector('.budget-amount');
    budgetDisplay.classList.add('subtle-pulse');
}

// Update reach estimates
function updateReachEstimates() {
    const stats = document.querySelectorAll('.stat-value');
    const duration = parseInt(document.querySelector('input[name="duration"]:checked').value);
    const targetAudience = document.querySelector('.boost-select').value;
    
    const estimates = calculateEstimates(duration, targetAudience);
    
    stats.forEach((stat, index) => {
        stat.style.transform = 'scale(0.98)';
        setTimeout(() => {
            stat.textContent = estimates[index];
            stat.style.transform = 'scale(1)';
        }, 200);
    });
}

// Calculate reach estimates
function calculateEstimates(duration, targetAudience) {
    const baseViews = 10000;
    const baseLikes = 500;
    const baseRetweets = 100;
    
    let multiplier = duration / 24;
    if (targetAudience === 'followers') multiplier *= 0.8;
    if (targetAudience === 'gamers') multiplier *= 1.2;
    
    return [
        `${Math.floor(baseViews * multiplier)}k - ${Math.floor(baseViews * multiplier * 1.5)}k`,
        `${Math.floor(baseLikes * multiplier)} - ${Math.floor(baseLikes * multiplier * 2)}`,
        `${Math.floor(baseRetweets * multiplier)} - ${Math.floor(baseRetweets * multiplier * 2)}`
    ];
}

// Add styles for subtle animations
const style = document.createElement('style');
style.textContent = `
    .btn-primary {
        transition: transform 0.2s ease, opacity 0.2s ease;
    }

    .btn-primary:hover {
        opacity: 0.9;
    }

    .subtle-pulse {
        animation: subtlePulse 2s infinite;
    }

    @keyframes subtlePulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }

    .duration-option {
        transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
    }

    .boost-select {
        transition: transform 0.2s ease, border-color 0.2s ease;
    }
`;

document.head.appendChild(style);