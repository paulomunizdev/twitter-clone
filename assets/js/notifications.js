document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const notificationsList = document.getElementById('notificationsList');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const markAllReadBtn = document.getElementById('markAllRead');

    // State
    let currentFilter = 'all';
    let isLoading = false;
    let page = 1;

    // Sample notification data (replace with actual API calls)
    const mockNotifications = [
        {
            id: 1,
            type: 'like',
            user: {
                name: 'Luigi',
                avatar: 'https://api.dicebear.com/6.x/fun-emoji/svg?seed=Luigi',
                handle: '@luigi'
            },
            content: 'liked your tweet',
            tweet: 'Super Mario Odyssey is an amazing game! The creativity and attention to detail is just incredible. #SuperMario',
            time: '2m',
            read: false
        },
        {
            id: 2,
            type: 'retweet',
            user: {
                name: 'Princess Peach',
                avatar: 'https://api.dicebear.com/6.x/fun-emoji/svg?seed=Peach',
                handle: '@peach'
            },
            content: 'retweeted your tweet',
            tweet: 'Just rescued the princess again! Another day at the office. 🍄👑',
            time: '15m',
            read: true
        },
        {
            id: 3,
            type: 'mention',
            user: {
                name: 'Yoshi',
                avatar: 'https://api.dicebear.com/6.x/fun-emoji/svg?seed=Yoshi',
                handle: '@yoshi'
            },
            content: 'mentioned you',
            tweet: 'Hey @mario, thanks for always having my back! Best duo ever! 🦖',
            time: '1h',
            read: false
        },
        {
            id: 4,
            type: 'follow',
            user: {
                name: 'Toad',
                avatar: 'https://api.dicebear.com/6.x/fun-emoji/svg?seed=Toad',
                handle: '@toad'
            },
            content: 'followed you',
            time: '2h',
            read: true
        }
    ];

    // Render notification item
    function renderNotification(notification) {
        const iconClass = {
            like: 'heart',
            retweet: 'retweet',
            mention: 'at',
            follow: 'user-plus'
        }[notification.type];

        return `
            <a href="#" class="notification-item ${notification.read ? '' : 'unread'}" data-id="${notification.id}">
                <div class="notification-icon ${notification.type}">
                    <i class="fas fa-${iconClass}"></i>
                </div>
                    <p class="notification-text">${notification.user.name} ${notification.content}</p>
                    ${notification.tweet ? `
                        <div class="notification-tweet">
                            ${notification.tweet}
                        </div>
                    ` : ''}
                </div>
            </a>
        `;
    }

    // Load notifications
    async function loadNotifications(filter = 'all') {
        if (isLoading) return;
        
        isLoading = true;
        loadingSpinner.classList.add('active');

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Filter notifications based on current filter
            let filteredNotifications = mockNotifications;
            if (filter !== 'all') {
                filteredNotifications = mockNotifications.filter(n => n.type === filter);
            }

            // Clear the list if it's the first page
            if (page === 1) {
                notificationsList.innerHTML = '';
            }

            // Render notifications
            filteredNotifications.forEach(notification => {
                notificationsList.insertAdjacentHTML('beforeend', renderNotification(notification));
            });

            // Update page number
            page++;

        } catch (error) {
            console.error('Error loading notifications:', error);
            notificationsList.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load notifications. Please try again later.</p>
                </div>
            `;
        } finally {
            isLoading = false;
            loadingSpinner.classList.remove('active');
        }
    }

    // Handle filter changes
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update current filter and reload notifications
            currentFilter = button.dataset.filter;
            page = 1;
            loadNotifications(currentFilter);
        });
    });

    // Handle mark all as read
    markAllReadBtn.addEventListener('click', async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Update UI
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
            });

            // Update mock data
            mockNotifications.forEach(notification => {
                notification.read = true;
            });

            // Show success message
            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>All notifications marked as read</span>
            `;
            document.body.appendChild(toast);

            // Remove toast after 3 seconds
            setTimeout(() => {
                toast.remove();
            }, 3000);

        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    });

    // Infinite scroll
    const observerOptions = {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
    };

    const intersectionObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !isLoading) {
            loadNotifications(currentFilter);
        }
    }, observerOptions);

    intersectionObserver.observe(loadingSpinner);

    // Individual notification click handler
    notificationsList.addEventListener('click', async (e) => {
        const notificationItem = e.target.closest('.notification-item');
        if (!notificationItem) return;

        e.preventDefault();

        if (!notificationItem.classList.contains('unread')) return;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 200));

            // Update UI
            notificationItem.classList.remove('unread');

            // Update mock data
            const notificationId = parseInt(notificationItem.dataset.id);
            const notification = mockNotifications.find(n => n.id === notificationId);
            if (notification) {
                notification.read = true;
            }

        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    });

    // Initial load
    loadNotifications();
});
                