document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.querySelector('.auth-container');
    const authCard = document.querySelector('.auth-card');
    const authFooter = document.querySelector('.auth-footer');

    // Login form template
    const loginTemplate = `
        <h1>Welcome to Twitter</h1>
        <div class="auth-form">
            <input type="text" placeholder="Email or username" class="auth-input" required>
            <input type="password" placeholder="Password" class="auth-input" required>
            
            <div class="auth-options">
                <button class="btn-primary btn-login">Login</button>
                <div class="auth-divider">
                    <span>or</span>
                </div>
                <button class="btn-secondary btn-switch-signup">Create Account</button>
            </div>

            <div class="auth-links">
                <a href="#" class="forgot-password">Forgot password?</a>
            </div>
        </div>
    `;

    // Signup form template
    const signupTemplate = `
        <h1>Create your account</h1>
        <div class="auth-form">
            <input type="text" placeholder="Full name" class="auth-input" required>
            <input type="text" placeholder="Username" class="auth-input" required>
            <input type="email" placeholder="Email" class="auth-input" required>
            <input type="password" placeholder="Password" class="auth-input" required>
            <input type="password" placeholder="Confirm password" class="auth-input" required>
            
            <div class="auth-options">
                <button class="btn-primary btn-signup">Register</button>
                <div class="auth-divider">
                    <span>or</span>
                </div>
                <button class="btn-secondary btn-switch-login">I already have an account</button>
            </div>
        </div>
    `;

    // Function to render login form
    function renderLoginForm() {
        authCard.innerHTML = loginTemplate;
        authFooter.innerHTML = `
            <p>Don't have an account? <a href="#" class="signup-link">Sign up</a></p>
        `;
        
        // Add event listeners for login form
        document.querySelector('.btn-login')?.addEventListener('click', handleLogin);
        document.querySelector('.btn-switch-signup')?.addEventListener('click', renderSignupForm);
        document.querySelector('.signup-link')?.addEventListener('click', renderSignupForm);
        document.querySelector('.forgot-password')?.addEventListener('click', handleForgotPassword);
    }

    // Function to render signup form
    function renderSignupForm() {
        authCard.innerHTML = signupTemplate;
        authFooter.innerHTML = `
            <p>Already have an account? <a href="#" class="login-link">Login</a></p>
        `;
        
        // Add event listeners for signup form
        document.querySelector('.btn-signup')?.addEventListener('click', handleSignup);
        document.querySelector('.btn-switch-login')?.addEventListener('click', renderLoginForm);
        document.querySelector('.login-link')?.addEventListener('click', renderLoginForm);
    }

    // Login handler
    function handleLogin(e) {
        e.preventDefault();
        const username = authCard.querySelector('input[placeholder="Email or username"]').value;
        const password = authCard.querySelector('input[placeholder="Password"]').value;

        if (!username || !password) {
            alert('Please fill in all fields');
            return;
        }

        // Simulated login (replace with actual authentication)
        console.log('Login attempt:', { username, password });
        // Typically, you'd make an API call here
        // example: 
        // authService.login(username, password)
        //     .then(handleSuccessfulLogin)
        //     .catch(handleLoginError);
    }

    // Signup handler
    function handleSignup(e) {
        e.preventDefault();
        const fullName = authCard.querySelector('input[placeholder="Full name"]').value;
        const username = authCard.querySelector('input[placeholder="Username"]').value;
        const email = authCard.querySelector('input[placeholder="Email"]').value;
        const password = authCard.querySelector('input[placeholder="Password"]').value;
        const confirmPassword = authCard.querySelector('input[placeholder="Confirm password"]').value;

        // Basic validation
        if (!fullName || !username || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Simulated signup (replace with actual registration)
        console.log('Signup attempt:', { fullName, username, email, password });
        // Typically, you'd make an API call here
        // example:
        // authService.register({ fullName, username, email, password })
        //     .then(handleSuccessfulSignup)
        //     .catch(handleSignupError);
    }

    // Forgot password handler
    function handleForgotPassword(e) {
        e.preventDefault();
        // Simulated forgot password (replace with actual flow)
        console.log('Forgot password initiated');
        alert('A password reset link will be sent to your email');
    }

    // Initial render - start with login form
    renderLoginForm();
});