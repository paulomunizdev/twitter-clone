document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    addAnimationStyles();
    initializeVIPStatus();
    initializeBenefits();
    initializePaymentHistory();
    initializeCancelButton();
});

// Add Required Animation Styles
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatIcon {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
        }
        
        @keyframes glowBadge {
            0% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
            50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
            100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
        }
        
        @keyframes fadeInScale {
            from { 
                transform: scale(0.95); 
                opacity: 0; 
            }
            to { 
                transform: scale(1); 
                opacity: 1; 
            }
        }
        
        @keyframes slideRight {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .benefit-icon {
            animation: floatIcon 3s ease-in-out infinite;
        }
        
        .vip-badge-large {
            animation: glowBadge 2s infinite;
        }
        
        .payment-item {
            transition: all 0.3s ease;
        }
        
        .payment-item:hover {
            transform: translateX(5px);
            background-color: rgba(255, 215, 0, 0.05);
        }
        
        .benefit-card {
            transition: all 0.3s ease;
        }
        
        .benefit-card:hover .benefit-icon {
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);
}

// Initialize VIP Status Section
function initializeVIPStatus() {
    const vipStatus = document.querySelector('.vip-status-header');
    const vipBadge = document.querySelector('.vip-badge-large');
    
    // Add entrance animation
    vipStatus.style.opacity = '0';
    vipStatus.style.animation = 'fadeInScale 0.5s ease forwards';
    
    // Add hover effect to VIP badge
    if (vipBadge) {
        vipBadge.addEventListener('mouseenter', () => {
            vipBadge.style.transform = 'scale(1.05)';
            vipBadge.style.transition = 'transform 0.3s ease';
        });
        
        vipBadge.addEventListener('mouseleave', () => {
            vipBadge.style.transform = 'scale(1)';
        });
    }
}

// Initialize Benefits Section
function initializeBenefits() {
    const benefits = document.querySelectorAll('.benefit-card');
    
    benefits.forEach((benefit, index) => {
        // Add staggered entrance animation
        benefit.style.opacity = '0';
        benefit.style.animation = `fadeInScale 0.5s ease ${index * 0.1}s forwards`;
        
        // Add hover effects
        benefit.addEventListener('mouseenter', () => {
            benefit.style.transform = 'translateY(-5px)';
            benefit.style.borderColor = 'var(--vip-gold)';
            
            const icon = benefit.querySelector('.benefit-icon');
            const status = benefit.querySelector('.status-badge');
            
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'all 0.3s ease';
            }
            
            if (status) {
                status.style.transform = 'scale(1.1)';
                status.style.transition = 'all 0.3s ease';
            }
        });
        
        benefit.addEventListener('mouseleave', () => {
            benefit.style.transform = 'translateY(0)';
            benefit.style.borderColor = '';
            
            const icon = benefit.querySelector('.benefit-icon');
            const status = benefit.querySelector('.status-badge');
            
            if (icon) {
                icon.style.transform = '';
            }
            
            if (status) {
                status.style.transform = '';
            }
        });
    });
}

// Initialize Payment History
function initializePaymentHistory() {
    const payments = document.querySelectorAll('.payment-item');
    const viewAllButton = document.querySelector('.view-all-payments .btn');
    
    // Add entrance animation to existing payments
    payments.forEach((payment, index) => {
        payment.style.opacity = '0';
        payment.style.animation = `slideRight 0.5s ease ${index * 0.1}s forwards`;
        
        // Add hover effect to amount
        const amount = payment.querySelector('.payment-amount');
        if (amount) {
            payment.addEventListener('mouseenter', () => {
                amount.style.color = 'var(--vip-gold-dark)';
                amount.style.transition = 'color 0.3s ease';
            });
            
            payment.addEventListener('mouseleave', () => {
                amount.style.color = '';
            });
        }
    });
    
    // Initialize view all button
    if (viewAllButton) {
        viewAllButton.addEventListener('click', handleViewAllPayments);
    }
}

// Handle View All Payments
async function handleViewAllPayments() {
    const button = document.querySelector('.view-all-payments .btn');
    const historyContainer = document.querySelector('.payment-history');
    
    if (button && historyContainer) {
        try {
            showLoadingState(button, 'Loading...');
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Add new payment items
            const newPayments = generateMockPayments(3);
            appendNewPayments(historyContainer, newPayments);
            
            showSuccessState(button, 'Loaded!');
        } catch (error) {
            showErrorState(button, 'Error');
        }
    }
}

// Initialize Cancel Button
function initializeCancelButton() {
    const cancelButton = document.querySelector('.btn-outline-danger');
    if (cancelButton) {
        cancelButton.addEventListener('click', handleCancelSubscription);
    }
}

// Handle Cancel Subscription
async function handleCancelSubscription() {
    const button = document.querySelector('.btn-outline-danger');
    
    if (confirm('Are you sure you want to cancel your VIP subscription? This action cannot be undone.')) {
        try {
            showLoadingState(button, 'Canceling...');
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            showSuccessState(button, 'Canceled');
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = '/panel/settings';
            }, 1500);
        } catch (error) {
            showErrorState(button, 'Error');
        }
    }
}

// Helper Functions
function showLoadingState(button, text) {
    const originalContent = button.innerHTML;
    button.dataset.originalContent = originalContent;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    button.disabled = true;
}

function showSuccessState(button, text) {
    button.innerHTML = `<i class="fas fa-check"></i> ${text}`;
    button.style.backgroundColor = '#4CAF50';
    button.style.borderColor = '#4CAF50';
    button.style.color = 'white';
    
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
    
    setTimeout(() => {
        button.innerHTML = button.dataset.originalContent;
        button.style.backgroundColor = '';
        button.style.borderColor = '';
        button.style.color = '';
        button.disabled = false;
    }, 2000);
}

// Generate Mock Payment Data
function generateMockPayments(count) {
    const payments = [];
    const today = new Date();
    
    for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - (3 + i));
        
        payments.push({
            date: date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            amount: '0.0001'
        });
    }
    
    return payments;
}

// Append New Payments
function appendNewPayments(container, payments) {
    payments.forEach((payment, index) => {
        const paymentElement = createPaymentElement(payment);
        container.appendChild(paymentElement);
        
        // Trigger animation
        setTimeout(() => {
            paymentElement.style.opacity = '1';
            paymentElement.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

// Create Payment Element
function createPaymentElement(payment) {
    const div = document.createElement('div');
    div.className = 'payment-item';
    div.style.opacity = '0';
    div.style.transform = 'translateX(-20px)';
    div.style.transition = 'all 0.3s ease';
    
    div.innerHTML = `
        <div class="payment-info">
            <i class="fas fa-receipt"></i>
            <div class="payment-details">
                <h4>Monthly VIP Subscription</h4>
                <p>${payment.date}</p>
            </div>
        </div>
        <div class="payment-amount">₿ ${payment.amount}</div>
    `;
    
    return div;
}