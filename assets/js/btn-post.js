document.addEventListener('DOMContentLoaded', () => {
    const tweetButtons = document.querySelectorAll('.btn-tweet');

    tweetButtons.forEach(button => {
        // Create ripple effect container
        const rippleContainer = document.createElement('div');
        rippleContainer.className = 'ripple-container';
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(rippleContainer);

        // Add hover animation
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.02)';
            button.style.transition = 'all 0.2s ease';
            button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = 'none';
        });

        // Add click effects
        button.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            rippleContainer.appendChild(ripple);

            // Add click animation
            button.style.transform = 'scale(0.95)';
            
            // Create and append the success checkmark
            const checkmark = document.createElement('i');
            checkmark.className = 'fas fa-check success-check';
            checkmark.style.position = 'absolute';
            checkmark.style.opacity = '0';
            checkmark.style.transform = 'scale(0)';
            button.appendChild(checkmark);

            // Animate the checkmark
            setTimeout(() => {
                checkmark.style.transition = 'all 0.3s ease';
                checkmark.style.opacity = '1';
                checkmark.style.transform = 'scale(1)';
            }, 100);

            // Cleanup
            setTimeout(() => {
                ripple.remove();
                button.style.transform = 'scale(1)';
                checkmark.style.opacity = '0';
                setTimeout(() => checkmark.remove(), 300);
            }, 600);
        });

        // Add focus states for accessibility
        button.addEventListener('focus', () => {
            button.style.boxShadow = '0 0 0 3px rgba(29, 161, 242, 0.3)';
        });

        button.addEventListener('blur', () => {
            button.style.boxShadow = 'none';
        });
    });

    // Add necessary styles to document
    const style = document.createElement('style');
    style.textContent = `
        .btn-tweet {
            position: relative;
            transition: all 0.2s ease;
        }

        .ripple-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
        }

        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: ripple 0.6s linear;
        }

        .success-check {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            color: white;
            font-size: 1.2em;
            pointer-events: none;
        }

        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
        }

        .btn-tweet:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .btn-tweet:not(:disabled):active {
            transform: scale(0.95);
        }
    `;

    document.head.appendChild(style);

    // Function to update button states based on text input
    function updateTweetButtonStates() {
        const tweetTextarea = document.querySelector('.tweet-textarea');
        const tweetButton = document.querySelector('.btn-tweet');

        if (tweetTextarea && tweetButton) {
            tweetTextarea.addEventListener('input', () => {
                const isEmpty = tweetTextarea.value.trim() === '';
                tweetButton.disabled = isEmpty;
                
                // Add character count animation if approaching limit
                const maxLength = 280;
                const remainingChars = maxLength - tweetTextarea.value.length;
                
                if (remainingChars <= 20) {
                    tweetButton.style.animation = 'pulse 1s infinite';
                } else {
                    tweetButton.style.animation = '';
                }
            });
        }
    }

    // Initialize button states
    updateTweetButtonStates();
});