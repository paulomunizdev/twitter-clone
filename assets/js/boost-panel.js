document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    addAnimationStyles();
    initializeBoostCards();
    initializeFilters();
    initializeLoadMore();
    initializeBoostSettings();
    updateTimers();
    initializeWalletEffects();
    initializeStatsAnimation();
    initializeBoostActions();
});

// Add Required Animation Styles
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .stat-value {
            transition: all 0.3s ease;
        }
        
        .loading-shimmer {
            animation: shimmer 2s infinite linear;
            background: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
            background-size: 1000px 100%;
        }
        
        .hover-scale {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .hover-scale:hover {
            transform: scale(1.02);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        .button-loading {
            position: relative;
            overflow: hidden;
        }
        
        .button-loading::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: shimmer 1.5s infinite;
        }
    `;
    document.head.appendChild(style);
}

// Initialize Boost Cards
function initializeBoostCards() {
    const boostCards = document.querySelectorAll('.boost-card');
    
    boostCards.forEach((card, index) => {
        // Add entrance animation
        card.style.opacity = '0';
        card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
        card.classList.add('hover-scale');
        
        // Initialize stats animations
        const stats = card.querySelectorAll('.stat-item');
        stats.forEach(stat => {
            initializeStatItem(stat);
        });
        
        // Initialize buttons
        const buttons = card.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', createRippleEffect);
        });
        
        // Initialize post content animations
        const postContent = card.querySelector('.post-content');
        if (postContent) {
            initializePostContent(postContent);
        }
        
        // Initialize media preview if exists
        const mediaPreview = card.querySelector('.post-media');
        if (mediaPreview) {
            initializeMediaPreview(mediaPreview);
        }
    });
}

// Initialize Individual Stat Item
function initializeStatItem(stat) {
    stat.addEventListener('mouseenter', () => {
        stat.style.transform = 'translateY(-5px)';
        stat.style.transition = 'transform 0.3s ease';
        
        const value = stat.querySelector('.stat-value');
        if (value) {
            value.style.color = 'var(--twitter-blue)';
        }
    });
    
    stat.addEventListener('mouseleave', () => {
        stat.style.transform = 'translateY(0)';
        const value = stat.querySelector('.stat-value');
        if (value) {
            value.style.color = '';
        }
    });
}

// Initialize Post Content
function initializePostContent(content) {
    content.addEventListener('mouseenter', () => {
        content.style.transform = 'scale(1.01)';
        content.style.transition = 'all 0.3s ease';
        content.style.backgroundColor = 'var(--twitter-background)';
    });
    
    content.addEventListener('mouseleave', () => {
        content.style.transform = 'scale(1)';
        content.style.backgroundColor = '';
    });
}

// Initialize Media Preview
function initializeMediaPreview(media) {
    media.addEventListener('mouseenter', () => {
        media.style.transform = 'scale(1.02)';
        media.style.transition = 'transform 0.3s ease';
    });
    
    media.addEventListener('mouseleave', () => {
        media.style.transform = 'scale(1)';
    });
}

// Create Ripple Effect
function createRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size/2}px`;
    ripple.style.top = `${e.clientY - rect.top - size/2}px`;
    ripple.classList.add('ripple');
    
    // Remove existing ripples
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// Initialize Stats Animation
function initializeStatsAnimation() {
    const stats = document.querySelectorAll('.stat-value');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const value = parseInt(element.textContent.replace(/[^0-9]/g, ''));
                animateValue(element, 0, value, 1500);
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.5
    });
    
    stats.forEach(stat => observer.observe(stat));
}

// Animate Numerical Values
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    
    function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    }
    
    window.requestAnimationFrame(step);
}

// Initialize Filters
function initializeFilters() {
    const filterSelect = document.querySelector('.select-filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', handleFilterChange);
    }
}

// Handle Filter Change
async function handleFilterChange(e) {
    const value = e.target.value;
    const historyList = document.querySelector('.boost-history-list');
    
    if (historyList) {
        // Add loading state
        historyList.style.opacity = '0.5';
        historyList.style.pointerEvents = 'none';
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Update list with filtered items
            const items = generateMockHistoryItems(5);
            updateHistoryList(historyList, items);
            
        } catch (error) {
            console.error('Error filtering items:', error);
        } finally {
            historyList.style.opacity = '1';
            historyList.style.pointerEvents = 'auto';
        }
    }
}

// Update History List
function updateHistoryList(container, items) {
    container.innerHTML = '';
    
    items.forEach((item, index) => {
        const element = createBoostHistoryElement(item);
        container.appendChild(element);
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize Wallet Effects
function initializeWalletEffects() {
    const walletBalance = document.querySelector('.wallet-balance');
    const bitcoinIcon = walletBalance?.querySelector('.fab.fa-bitcoin');
    
    if (walletBalance && bitcoinIcon) {
        // Pulse animation for Bitcoin icon
        setInterval(() => {
            bitcoinIcon.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                bitcoinIcon.style.animation = '';
            }, 500);
        }, 5000);
        
        // Hover effects
        walletBalance.addEventListener('mouseenter', () => {
            walletBalance.style.transform = 'scale(1.05)';
            walletBalance.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            bitcoinIcon.style.color = '#f7931a';
        });
        
        walletBalance.addEventListener('mouseleave', () => {
            walletBalance.style.transform = 'scale(1)';
            walletBalance.style.boxShadow = 'none';
            bitcoinIcon.style.color = '';
        });
    }
}

// Initialize Boost Settings
function initializeBoostSettings() {
    const form = document.querySelector('.settings-options');
    if (!form) return;
    
    // Initialize switches
    const switches = form.querySelectorAll('.switch input[type="checkbox"]');
    switches.forEach(switchInput => {
        switchInput.addEventListener('change', handleSettingChange);
    });
    
    // Initialize selects
    const selects = form.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', handleSettingChange);
    });
}

// Handle Setting Change
async function handleSettingChange(e) {
    const settingName = e.target.name;
    const settingValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    
    // Show saving indicator
    showSavingIndicator();
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        showSaveSuccess();
    } catch (error) {
        showSaveError();
    }
}

// Initialize Boost Actions
function initializeBoostActions() {
    // Extend Boost buttons
    document.querySelectorAll('.btn-primary:contains("Extend Boost")').forEach(btn => {
        btn.addEventListener('click', handleExtendBoost);
    });
    
    // Boost Again buttons
    document.querySelectorAll('.btn:contains("Boost Again")').forEach(btn => {
        btn.addEventListener('click', handleBoostAgain);
    });
    
    // View Report buttons
    document.querySelectorAll('.btn:contains("View Report")').forEach(btn => {
        btn.addEventListener('click', handleViewReport);
    });
}

// Handle Extend Boost
async function handleExtendBoost(e) {
    const button = e.currentTarget;
    showLoadingState(button, 'Extending...');
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update timer
        const card = button.closest('.boost-card');
        const timer = card.querySelector('.boost-timer');
        if (timer) {
            const currentHours = parseInt(timer.textContent);
            updateTimer(timer, currentHours + 24);
        }
        
        showSuccessState(button, 'Extended!');
    } catch (error) {
        showErrorState(button, 'Error');
    }
}

// Update Timer
function updateTimer(timerElement, hours) {
    timerElement.style.animation = 'fadeInUp 0.3s ease';
    setTimeout(() => {
        timerElement.innerHTML = `<i class="fas fa-clock"></i> ${hours}h remaining`;
        timerElement.style.animation = '';
    }, 300);
}

// Handle Boost Again
async function handleBoostAgain(e) {
    const button = e.currentTarget;
    showLoadingState(button, 'Boosting...');
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        showSuccessState(button, 'Boosted!');
    } catch (error) {
        showErrorState(button, 'Error');
    }
}

// Handle View Report
async function handleViewReport(e) {
    const button = e.currentTarget;
    showLoadingState(button, 'Loading...');
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.location.href = '/boost/report/' + button.closest('.boost-card').dataset.boostId;
    } catch (error) {
        showErrorState(button, 'Error');
    }
}

// Helper Functions
function showLoadingState(button, text) {
    const originalContent = button.innerHTML;
    button.dataset.originalContent = originalContent;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    button.disabled = true;
    button.classList.add('button-loading');
}

function showSuccessState(button, text) {
    button.innerHTML = `<i class="fas fa-check"></i> ${text}`;
    button.style.backgroundColor = '#4CAF50';
    button.style.borderColor = '#4CAF50';
    button.style.color = 'white';
    button.classList.remove('button-loading');
    
    setTimeout(() => {
        button.innerHTML = button.dataset.originalContent;
        button.style.backgroundColor = '';
        button.style.borderColor = '';
        button.style.color = '';
        button.disabled = false;
    }, 2000);
}

function showErrorState(button, text) {
    button.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${text}`;
    button.style.backgroundColor = '#dc3545';
    button.style.borderColor = '#dc3545';
    button.style.color = 'white';
    button.classList.remove('button-loading');
    
    setTimeout(() => {
        button.innerHTML = button.dataset.originalContent;
        button.style.backgroundColor = '';
        button.style.borderColor = '';
        button.style.color = '';
        button.disabled = false;
    }, 2000);
}

// Save Indicator Functions
function showSavingIndicator() {
    const saveButton = document.querySelector('.form-actions .btn-primary');
    if (saveButton) {
        showLoadingState(saveButton, 'Saving...');
    }
}

function showSaveSuccess() {
    const saveButton = document.querySelector('.form-actions .btn-primary');
    if (saveButton) {
        showSuccessState(saveButton, 'Saved!');
    }
}

function showSaveError() {
    const saveButton = document.querySelector('.form-actions .btn-primary');
    if (saveButton) {
        showErrorState(saveButton, 'Error saving');
    }
}

// Generate Mock Data
function generateMockHistoryItems(count) {
    const items = [];
    const baseDate = new Date();
    
    for (let i = 0; i < count; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() - (i + 1));
        
        items.push({
            id: Math.random().toString(36).substr(2, 9),
            status: Math.random() > 0.1 ? 'completed' : 'failed',
            duration: `${Math.floor(Math.random() * 3 + 1) * 24}h`,
            date: date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            stats: {
                views: Math.floor(Math.random() * 15000 + 5000),
                likes: Math.floor(Math.random() * 8000 + 2000),
                comments: Math.floor(Math.random() * 2000 + 500)
            },
            cost: (Math.random() * 0.003 + 0.001).toFixed(6)
        });
    }
    
    return items;
}

// Create Boost History Element
function createBoostHistoryElement(item) {
    const div = document.createElement('div');
    div.className = 'boost-card history';
    div.dataset.boostId = item.id;
    div.style.opacity = '0';
    div.style.transform = 'translateY(20px)';
    div.style.transition = 'all 0.3s ease';
    
    div.innerHTML = `
        <div class="boost-status ${item.status}">
            <div class="status-indicator">
                <i class="fas fa-${item.status === 'completed' ? 'check-circle' : 'times-circle'}"></i>
                ${item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </div>
            <div class="boost-info">
                <span class="boost-duration">${item.duration} boost</span>
                <span class="boost-date">${item.date}</span>
            </div>
        </div>
        <div class="post-preview">
            <img src="https://api.dicebear.com/6.x/fun-emoji/svg?seed=Mario" alt="Profile" class="author-avatar">
            <div class="post-content">
                <div class="post-header">
                    <div class="author-info">
                        <span class="author-name">Mario Bros</span>
                        <span class="author-handle">@mario</span>
                    </div>
                    <span class="boost-cost">₿ ${item.cost}</span>
                </div>
                <p class="post-text">Sample boosted post content #${Math.floor(Math.random() * 1000)}</p>
            </div>
        </div>
        <div class="boost-stats">
            <div class="stat-item primary">
                <i class="fas fa-eye"></i>
                <span class="stat-value">${item.stats.views.toLocaleString()}</span>
                <span class="stat-label">Views</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-heart"></i>
                <span class="stat-value">${item.stats.likes.toLocaleString()}</span>
                <span class="stat-label">Likes</span>
            </div>
            <div class="stat-item">
                <i class="far fa-comment"></i>
                <span class="stat-value">${item.stats.comments.toLocaleString()}</span>
                <span class="stat-label">Comments</span>
            </div>
        </div>
        <div class="boost-actions">
            <button class="btn btn-outline btn-sm">
                <i class="fas fa-chart-bar"></i>
                View Report
            </button>
            <button class="btn btn-primary btn-sm">
                <i class="fas fa-rocket"></i>
                Boost Again
            </button>
        </div>
    `;
    
    return div;
}