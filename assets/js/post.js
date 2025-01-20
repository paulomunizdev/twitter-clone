// post.js
let activeReplyBox = null;

function handleReply(button) {
    // Remove qualquer caixa de resposta existente
    if (activeReplyBox) {
        activeReplyBox.remove();
    }

    // Encontra o tweet pai
    const tweet = button.closest('.tweet');
    
    // Cria a caixa de resposta
    const replyBox = document.createElement('div');
    replyBox.className = 'reply-form-container';
    
    // Pega o username do tweet original
    const username = tweet.querySelector('.tweet-username').textContent;
    const name = tweet.querySelector('.tweet-name').textContent;
    const isReplyToReply = tweet.classList.contains('reply');
    
    // Adiciona margin-left se for resposta a uma resposta
    if (isReplyToReply) {
        replyBox.style.marginLeft = '40px';
    }
    
    replyBox.innerHTML = `
        <img src="https://api.dicebear.com/6.x/fun-emoji/svg?seed=User" alt="Your avatar" class="avatar">
        <form class="reply-form" onsubmit="handleReplySubmit(event, this, '${username}', '${name}', ${isReplyToReply})">
            <div style="color: var(--twitter-secondary); margin-bottom: 8px;">
                Replying to ${username}
            </div>
            <textarea 
                placeholder="Tweet your reply"
                maxlength="280"
                oninput="updateCounter(this)"></textarea>
            <div class="form-actions">
                <div class="form-tools">
                    <button type="button" class="tool-button">
                        <i class="far fa-image"></i>
                    </button>
                    <button type="button" class="tool-button">
                        <i class="far fa-smile"></i>
                    </button>
                </div>
                <div class="form-submit">
                    <button type="button" class="btn-cancel" onclick="cancelReply(this)">Cancel</button>
                    <span class="text-counter">280</span>
                    <button type="submit" class="btn btn-tweet" disabled>Reply</button>
                </div>
            </div>
        </form>
    `;

    // Adiciona a caixa de resposta após o tweet
    tweet.insertAdjacentElement('afterend', replyBox);
    activeReplyBox = replyBox;

    // Foca no textarea
    replyBox.querySelector('textarea').focus();
}

function updateCounter(textarea) {
    const form = textarea.closest('form');
    const counter = form.querySelector('.text-counter');
    const submitBtn = form.querySelector('.btn-tweet');
    
    const remaining = 280 - textarea.value.length;
    counter.textContent = remaining;
    
    submitBtn.disabled = textarea.value.trim().length === 0;
}

function cancelReply(button) {
    const replyBox = button.closest('.reply-form-container');
    replyBox.remove();
    activeReplyBox = null;
}

function handleReplySubmit(event, form, replyingToUsername, replyingToName, isReplyToReply) {
    event.preventDefault();
    
    const textarea = form.querySelector('textarea');
    const text = textarea.value.trim();
    
    if (text) {
        // Cria o novo tweet de resposta
        const newReply = document.createElement('article');
        newReply.className = 'tweet reply';
        
        // Adiciona margin-left se for resposta a uma resposta
        if (isReplyToReply) {
            newReply.style.marginLeft = '40px';
        }
        
        newReply.innerHTML = `
            <img class="avatar" src="https://api.dicebear.com/6.x/fun-emoji/svg?seed=User" alt="User avatar">
            <div class="tweet-content">
                <div class="tweet-header">
                    <div class="tweet-author-info">
                        <span class="tweet-name">User</span>
                        <span class="tweet-username">@user</span>
                        <span class="tweet-time">· just now</span>
                    </div>
                </div>
                <div class="replied-to">
                    Replying to <a href="/${replyingToUsername.replace('@', '')}">${replyingToUsername}</a>
                </div>
                <p>${text}</p>
                <div class="tweet-actions-list">
                    <button class="tweet-action-button" onclick="handleReply(this)">
                        <i class="far fa-comment"></i>
                        <span>0</span>
                    </button>
                    <button class="tweet-action-button">
                        <i class="fas fa-retweet"></i>
                        <span>0</span>
                    </button>
                    <button class="tweet-action-button">
                        <i class="far fa-heart"></i>
                        <span>0</span>
                    </button>
                    <button class="tweet-action-button">
                        <i class="fas fa-rocket"></i>
                    </button>
                </div>
            </div>
        `;

        // Adiciona o novo tweet após o tweet original
        const replyBox = form.closest('.reply-form-container');
        replyBox.insertAdjacentElement('afterend', newReply);
        
        // Remove a caixa de resposta
        replyBox.remove();
        activeReplyBox = null;
    }
}

// Inicialização do contador no formulário principal
document.addEventListener('DOMContentLoaded', function() {
    const mainForm = document.getElementById('mainReplyForm');
    if (mainForm) {
        const textarea = mainForm.querySelector('textarea');
        const counter = mainForm.querySelector('.text-counter');
        const submitButton = mainForm.querySelector('.btn-tweet');

        textarea.addEventListener('input', function() {
            updateCounter(textarea);
        });
    }
});