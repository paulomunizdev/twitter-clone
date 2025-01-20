document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionalities
    initializeCopyAddress();
    initializeTransactionHistory();
    initializeBalanceUpdates();
    initializeBalanceEffects();
});

// Balance Effects and Animations
function initializeBalanceEffects() {
    const balanceOverview = document.querySelector('.balance-overview');
    const balanceAmount = document.querySelector('.balance-amount');
    const infoItems = document.querySelectorAll('.info-item');
    
    // Add hover effect to balance overview
    balanceOverview.addEventListener('mouseenter', () => {
        balanceAmount.style.transform = 'scale(1.05)';
        balanceAmount.style.transition = 'transform 0.3s ease';
    });
    
    balanceOverview.addEventListener('mouseleave', () => {
        balanceAmount.style.transform = 'scale(1)';
    });
    
    // Add pulse animation to Bitcoin icon
    const bitcoinIcon = balanceAmount.querySelector('.fab.fa-bitcoin');
    setInterval(() => {
        bitcoinIcon.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            bitcoinIcon.style.animation = '';
        }, 500);
    }, 5000);
    
    // Add counting animation for initial load
    const balanceText = balanceAmount.querySelector('span');
    const targetBalance = parseFloat(balanceText.textContent);
    animateValue(balanceText, 0, targetBalance, 1500);
    
    // Add hover effects for info items
    infoItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-2px)';
            item.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
        });
    });
}

// Copy Address Functionality
function initializeCopyAddress() {
    const addressInput = document.querySelector('.address-input');
    const copyButton = addressInput.nextElementSibling;
    
    copyButton.addEventListener('click', async function() {
        try {
            await navigator.clipboard.writeText(addressInput.value);
            
            // Update button state with animation
            const originalContent = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyButton.style.backgroundColor = '#4CAF50';
            copyButton.style.color = 'white';
            copyButton.style.transform = 'scale(1.05)';
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            copyButton.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
                copyButton.innerHTML = originalContent;
                copyButton.style.backgroundColor = '';
                copyButton.style.color = '';
                copyButton.style.transform = '';
            }, 2000);
        } catch (err) {
            copyButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
            copyButton.style.backgroundColor = '#dc3545';
            copyButton.style.color = 'white';
            
            setTimeout(() => {
                copyButton.innerHTML = originalContent;
                copyButton.style.backgroundColor = '';
                copyButton.style.color = '';
            }, 2000);
        }
    });

    // Add hover effect to address input
    addressInput.addEventListener('mouseenter', () => {
        addressInput.style.transform = 'translateX(5px)';
        addressInput.style.transition = 'transform 0.3s ease';
    });
    
    addressInput.addEventListener('mouseleave', () => {
        addressInput.style.transform = 'translateX(0)';
    });
    
    // Select text on click
    addressInput.addEventListener('click', function() {
        this.select();
    });
}

// Transaction History Management
function initializeTransactionHistory() {
    const viewAllButton = document.querySelector('.view-all-transactions .btn');
    const transactionList = document.querySelector('.transaction-list');
    let isLoading = false;
    let page = 1;
    
    // Add hover effects to transaction items
    addTransactionHoverEffects();
    
    viewAllButton.addEventListener('click', async function() {
        if (isLoading) return;
        
        isLoading = true;
        const originalContent = viewAllButton.innerHTML;
        viewAllButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const newTransactions = generateMockTransactions(5, page);
            appendTransactions(newTransactions);
            
            page++;
            
            if (page > 3) {
                fadeOut(viewAllButton);
            }
        } catch (error) {
            console.error('Error loading transactions:', error);
            viewAllButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
        } finally {
            isLoading = false;
            if (page <= 3) {
                viewAllButton.innerHTML = originalContent;
            }
        }
    });
}

// Balance Updates
function initializeBalanceUpdates() {
    const balanceAmount = document.querySelector('.balance-amount span');
    const totalDeposited = document.querySelector('.info-value');
    
    setInterval(() => {
        checkForBalanceUpdates();
    }, 30000);
}

// Helper Functions
function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = start + (end - start) * progress;
        element.textContent = `${currentValue.toFixed(6)} BTC`;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function addTransactionHoverEffects() {
    const transactions = document.querySelectorAll('.transaction-item');
    
    transactions.forEach(tx => {
        tx.addEventListener('mouseenter', () => {
            tx.style.transform = 'translateX(5px)';
            tx.style.transition = 'transform 0.3s ease';
        });
        
        tx.addEventListener('mouseleave', () => {
            tx.style.transform = 'translateX(0)';
        });
    });
}

function appendTransactions(transactions) {
    const transactionList = document.querySelector('.transaction-list');
    
    transactions.forEach(tx => {
        const txElement = createTransactionElement(tx);
        txElement.style.opacity = '0';
        txElement.style.transform = 'translateY(20px)';
        transactionList.appendChild(txElement);
        
        // Trigger animation
        setTimeout(() => {
            txElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            txElement.style.opacity = '1';
            txElement.style.transform = 'translateY(0)';
            addTransactionHoverEffects();
        }, 100);
    });
}

function createTransactionElement(tx) {
    const div = document.createElement('div');
    div.className = 'transaction-item';
    div.innerHTML = `
        <div class="transaction-status ${tx.status}">
            <i class="fas fa-${tx.status === 'confirmed' ? 'check-circle' : 'clock'}"></i>
        </div>
        <div class="transaction-info">
            <div class="transaction-details">
                <h4>${tx.status === 'confirmed' ? 'Deposit Confirmed' : 'Deposit Pending'}</h4>
                <span class="transaction-date">${tx.date}</span>
            </div>
            <div class="transaction-id">
                <span>TxID:</span>
                <a href="#" class="tx-link">${tx.txid}</a>
            </div>
        </div>
        <div class="transaction-amount positive">
            <span>+${tx.amount} BTC</span>
            <div class="confirmations">${tx.status}</div>
        </div>
    `;
    return div;
}

function generateMockTransactions(count, page) {
    const transactions = [];
    const baseDate = new Date();
    
    for (let i = 0; i < count; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() - (page * count + i));
        
        transactions.push({
            status: Math.random() > 0.2 ? 'confirmed' : 'pending',
            date: date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            txid: generateRandomTxId(),
            amount: (Math.random() * 0.001 + 0.0001).toFixed(6)
        });
    }
    
    return transactions;
}

function generateRandomTxId() {
    const chars = '0123456789abcdef';
    let txid = '';
    for (let i = 0; i < 6; i++) {
        txid += chars[Math.floor(Math.random() * chars.length)];
    }
    return txid + '...' + chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)];
}

function fadeOut(element) {
    element.style.transition = 'opacity 0.5s ease';
    element.style.opacity = '0';
    setTimeout(() => {
        element.style.display = 'none';
    }, 500);
}

async function checkForBalanceUpdates() {
    try {
        if (Math.random() < 0.3) {
            const balanceAmount = document.querySelector('.balance-amount span');
            const currentBalance = parseFloat(balanceAmount.textContent.split(' ')[0]);
            const updatedBalance = (currentBalance + Math.random() * 0.0001).toFixed(6);
            
            // Flash effect before update
            balanceAmount.style.transition = 'background-color 0.3s ease';
            balanceAmount.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
            
            // Animate the balance update
            await animateBalanceUpdate(balanceAmount, currentBalance, updatedBalance);
            
            // Remove flash effect
            setTimeout(() => {
                balanceAmount.style.backgroundColor = 'transparent';
            }, 300);
        }
    } catch (error) {
        console.error('Error checking for balance updates:', error);
    }
}

async function animateBalanceUpdate(element, startValue, endValue) {
    const duration = 1000;
    const startTime = performance.now();
    
    return new Promise(resolve => {
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = startValue + (endValue - startValue) * progress;
            element.textContent = currentValue.toFixed(6) + ' BTC';
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                resolve();
            }
        }
        
        requestAnimationFrame(update);
    });
}