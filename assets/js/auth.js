// Constants and Configurations
const CONFIG = {
    VALIDATION: {
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        MIN_PASSWORD_LENGTH: 8,
        NAME_MIN_LENGTH: 2
    },
    ENDPOINTS: {
        LOGIN: '/auth/login',
        SIGNUP: '/signup'
    },
    STORAGE_KEYS: {
        REMEMBER_ME: 'rememberMe',
        USER_EMAIL: 'userEmail'
    }
};

const STYLES = {
    ACTIVE: 'active',
    ERROR: 'error',
    SUCCESS: 'success',
    LOADING: 'loading'
};

// Utility Functions
const utils = {
    /**
     * Debounce function to limit the rate at which a function is called
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Shows error message on form field
     */
    showError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');
        
        input.classList.add(STYLES.ERROR);
        input.classList.remove(STYLES.SUCCESS);
        input.setAttribute('aria-invalid', 'true');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.setAttribute('role', 'alert');
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    },

    /**
     * Removes error message from form field
     */
    removeError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        input.classList.remove(STYLES.ERROR);
        input.classList.add(STYLES.SUCCESS);
        input.setAttribute('aria-invalid', 'false');
        
        if (errorElement) {
            errorElement.remove();
        }
    },

    /**
     * Creates ripple effect on button click
     */
    createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        const rect = button.getBoundingClientRect();
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
        circle.addEventListener('animationend', () => circle.remove());
    }
};

// Form Validation Class
class FormValidator {
    constructor(form, config) {
        this.form = form;
        this.config = config;
    }

    validateEmail(email) {
        const value = email.value.trim();
        
        if (!value) {
            utils.showError(email, 'Email is required');
            return false;
        }
        
        if (!CONFIG.VALIDATION.EMAIL_REGEX.test(value)) {
            utils.showError(email, 'Please enter a valid email address');
            return false;
        }
        
        utils.removeError(email);
        return true;
    }

    validatePassword(password, isSignup = false) {
        const value = password.value;
        
        if (!value) {
            utils.showError(password, 'Password is required');
            return false;
        }
        
        if (isSignup && value.length < CONFIG.VALIDATION.MIN_PASSWORD_LENGTH) {
            utils.showError(password, `Password must be at least ${CONFIG.VALIDATION.MIN_PASSWORD_LENGTH} characters`);
            return false;
        }
        
        utils.removeError(password);
        return true;
    }

    validateName(name) {
        const value = name.value.trim();
        
        if (!value) {
            utils.showError(name, 'Name is required');
            return false;
        }
        
        if (value.length < CONFIG.VALIDATION.NAME_MIN_LENGTH) {
            utils.showError(name, 'Name is too short');
            return false;
        }
        
        utils.removeError(name);
        return true;
    }

    validateConfirmPassword(password, confirmPassword) {
        if (password.value !== confirmPassword.value) {
            utils.showError(confirmPassword, 'Passwords do not match');
            return false;
        }
        
        utils.removeError(confirmPassword);
        return true;
    }

    validateTerms(terms) {
        if (!terms.checked) {
            utils.showError(terms, 'You must accept the terms and conditions');
            return false;
        }
        
        utils.removeError(terms);
        return true;
    }
}

// Auth Forms Manager Class
class AuthFormsManager {
    constructor() {
        this.initElements();
        this.initValidators();
        this.setupEventListeners();
        this.setupPasswordToggles();
        this.restoreSavedData();
    }

    initElements() {
        // Tabs
        this.authTabs = document.querySelectorAll('.auth-tab');
        
        // Forms
        this.forms = {
            login: {
                form: document.getElementById('loginForm'),
                email: document.getElementById('loginEmail'),
                password: document.getElementById('loginPassword'),
                remember: document.getElementById('loginRemember')
            },
            signup: {
                form: document.getElementById('signupForm'),
                name: document.getElementById('signupName'),
                email: document.getElementById('signupEmail'),
                password: document.getElementById('signupPassword'),
                confirmPassword: document.getElementById('signupConfirmPassword'),
                terms: document.getElementById('signupTerms')
            }
        };
    }

    initValidators() {
        this.loginValidator = new FormValidator(this.forms.login.form);
        this.signupValidator = new FormValidator(this.forms.signup.form);
    }

    setupEventListeners() {
        // Tab switching
        this.authTabs.forEach(tab => {
            tab.addEventListener('click', this.handleTabSwitch.bind(this));
        });

        // Form submissions
        this.forms.login.form.addEventListener('submit', this.handleLogin.bind(this));
        this.forms.signup.form.addEventListener('submit', this.handleSignup.bind(this));

        // Live validation
        this.setupValidationListeners();

        // Ripple effect
        document.querySelectorAll('.btn, .btn-submit').forEach(button => {
            button.addEventListener('click', utils.createRipple);
        });
    }

    setupPasswordToggles() {
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const input = toggle.previousElementSibling;
                const icon = toggle.querySelector('i');
                
                const newType = input.type === 'password' ? 'text' : 'password';
                input.type = newType;
                
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
                
                input.focus();
            });
        });
    }

    setupValidationListeners() {
        const debouncedValidation = utils.debounce((input, validationFn) => {
            if (input.classList.contains(STYLES.ERROR) || input.value) {
                validationFn();
            }
        }, 300);

        // Login form validation
        this.forms.login.email.addEventListener('input', () => 
            debouncedValidation(this.forms.login.email, () => 
                this.loginValidator.validateEmail(this.forms.login.email))
        );
        
        this.forms.login.password.addEventListener('input', () => 
            debouncedValidation(this.forms.login.password, () => 
                this.loginValidator.validatePassword(this.forms.login.password))
        );

        // Signup form validation
        this.forms.signup.name.addEventListener('input', () => 
            debouncedValidation(this.forms.signup.name, () => 
                this.signupValidator.validateName(this.forms.signup.name))
        );
        
        this.forms.signup.email.addEventListener('input', () => 
            debouncedValidation(this.forms.signup.email, () => 
                this.signupValidator.validateEmail(this.forms.signup.email))
        );
        
        this.forms.signup.password.addEventListener('input', () => {
            debouncedValidation(this.forms.signup.password, () => {
                this.signupValidator.validatePassword(this.forms.signup.password, true);
                if (this.forms.signup.confirmPassword.value) {
                    this.signupValidator.validateConfirmPassword(
                        this.forms.signup.password,
                        this.forms.signup.confirmPassword
                    );
                }
            });
        });
        
        this.forms.signup.confirmPassword.addEventListener('input', () => 
            debouncedValidation(this.forms.signup.confirmPassword, () => 
                this.signupValidator.validateConfirmPassword(
                    this.forms.signup.password,
                    this.forms.signup.confirmPassword
                ))
        );
    }

    handleTabSwitch(event) {
        const targetForm = event.currentTarget.dataset.form;
        
        // Update tabs
        this.authTabs.forEach(tab => {
            tab.classList.toggle(STYLES.ACTIVE, tab.dataset.form === targetForm);
            tab.setAttribute('aria-selected', tab.dataset.form === targetForm);
        });

        // Update forms
        Object.values(this.forms).forEach(({ form }) => {
            form.classList.remove(STYLES.ACTIVE);
        });
        this.forms[targetForm].form.classList.add(STYLES.ACTIVE);

        // Update header text
        const header = document.querySelector('.auth-header');
        if (targetForm === 'login') {
            header.querySelector('.auth-title').textContent = 'Log in to Twitter';
            header.querySelector('.auth-subtitle').textContent = 'Welcome back!';
        } else {
            header.querySelector('.auth-title').textContent = 'Create your account';
            header.querySelector('.auth-subtitle').textContent = 'Join our community today!';
        }
    }

    async handleLogin(event) {
        event.preventDefault();

        const isEmailValid = this.loginValidator.validateEmail(this.forms.login.email);
        const isPasswordValid = this.loginValidator.validatePassword(this.forms.login.password);

        if (!isEmailValid || !isPasswordValid) return;

        const submitButton = this.forms.login.form.querySelector('.btn-submit');
        submitButton.classList.add(STYLES.LOADING);
        submitButton.disabled = true;

        try {
            this.handleRememberMe();
            
            const response = await fetch(CONFIG.ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: this.forms.login.email.value,
                    password: this.forms.login.password.value,
                    remember: this.forms.login.remember.checked
                })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            window.location.href = '/dashboard';

        } catch (error) {
            utils.showError(this.forms.login.email, 'Invalid email or password');
            this.forms.login.password.value = '';
            utils.removeError(this.forms.login.password);
        } finally {
            submitButton.classList.remove(STYLES.LOADING);
            submitButton.disabled = false;
        }
    }

    async handleSignup(event) {
        event.preventDefault();

        const validations = [
            this.signupValidator.validateName(this.forms.signup.name),
            this.signupValidator.validateEmail(this.forms.signup.email),
            this.signupValidator.validatePassword(this.forms.signup.password, true),
            this.signupValidator.validateConfirmPassword(
                this.forms.signup.password,
                this.forms.signup.confirmPassword
            ),
            this.signupValidator.validateTerms(this.forms.signup.terms)
        ];

        if (validations.includes(false)) return;

        const submitButton = this.forms.signup.form.querySelector('.btn-submit');
        submitButton.classList.add(STYLES.LOADING);
        submitButton.disabled = true;

        try {
            const response = await fetch(CONFIG.ENDPOINTS.SIGNUP, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: this.forms.signup.name.value,
                    email: this.forms.signup.email.value,
                    password: this.forms.signup.password.value
                })
            });

            if (!response.ok) {
                throw new Error('Signup failed');
            }

            window.location.href = '/dashboard';

        } catch (error) {
            utils.showError(this.forms.signup.email, 'This email is already registered');
        } finally {
            submitButton.classList.remove(STYLES.LOADING);
            submitButton.disabled = false;
        }
    }

    handleRememberMe() {
        if (this.forms.login.remember.checked) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.REMEMBER_ME, 'true');
            localStorage.setItem(CONFIG.STORAGE_KEYS.USER_EMAIL, this.forms.login.email.value);
        } else {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.REMEMBER_ME);
            localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_EMAIL);
        }
    }

    restoreSavedData() {
        const remembered = localStorage.getItem(CONFIG.STORAGE_KEYS.REMEMBER_ME) === 'true';
        const savedEmail = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_EMAIL);
        
        if (remembered && savedEmail) {
            this.forms.login.email.value = savedEmail;
            this.forms.login.remember.checked = true;
        }
    }
}

// Button Effects Handler
class ButtonEffects {
    constructor() {
        this.buttons = document.querySelectorAll('.btn-submit');
        this.setupEffects();
    }

    setupEffects() {
        this.buttons.forEach(button => {
            // Wrap button text in span for sliding effect
            const buttonText = button.textContent;
            button.innerHTML = `<span class="btn-content">${buttonText}</span>`;

            // Add click effects
            button.addEventListener('click', (e) => this.handleClick(e));
            
            // Add hover tracking for dynamic effects
            button.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            button.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
        });
    }

    handleClick(event) {
        const button = event.currentTarget;
        
        // Add clicked effect
        button.classList.add('clicked');
        
        // Add pulse effect
        button.classList.add('pulse');
        
        // Create ripple effect
        this.createRipple(event);
        
        // Remove effects after animation
        setTimeout(() => {
            button.classList.remove('clicked');
            button.classList.remove('pulse');
        }, 300);
    }

    handleMouseMove(event) {
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Calculate rotation based on mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const maxRotation = 10; // Maximum rotation in degrees
        
        const rotateX = ((centerY - y) / centerY) * maxRotation;
        const rotateY = ((x - centerX) / centerX) * maxRotation;
        
        // Apply the rotation transform
        button.style.transform = `
            perspective(800px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
            translateZ(0)
        `;
    }

    handleMouseLeave(event) {
        const button = event.currentTarget;
        
        // Reset the transform
        button.style.transform = `
            perspective(800px) 
            rotateX(0deg) 
            rotateY(0deg)
            translateZ(0)
        `;
    }

    createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        const rect = button.getBoundingClientRect();
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');
        
        // Remove existing ripple
        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }
        
        button.appendChild(circle);
        
        // Remove the ripple after animation
        circle.addEventListener('animationend', () => circle.remove());
    }
}

// Initialize button effects when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ButtonEffects();
});

// Initialize auth forms when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AuthFormsManager();
});