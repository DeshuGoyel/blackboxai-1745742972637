// Assuming aiFeatures is globally available via script tag or included before this script

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AI features with user medical history (example)
    const userMedicalHistory = {
        conditions: ['diabetes', 'hypertension'],
        allergies: ['penicillin']
    };
    aiFeatures.loadMedicalHistory(userMedicalHistory);

    // Example: Suggest dietary adjustments based on medications
    const medications = db.getMedications();
    const dietarySuggestions = aiFeatures.suggestDietaryAdjustments(medications);
    console.log('Dietary Suggestions:', dietarySuggestions);

    // Get DOM elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const signInBtn = document.querySelector('[data-action="show-login"]');
    const getStartedBtn = document.querySelector('[data-action="show-register"]');
    const switchToRegisterLink = document.getElementById('switchToRegister');
    const switchToLoginLink = document.getElementById('switchToLogin');

    // Show login form
    function showLoginForm() {
        registerForm.style.transform = 'translateX(100%)';
        loginForm.style.transform = 'translateX(0)';
        
        // Update pointer events
        setTimeout(() => {
            registerForm.style.pointerEvents = 'none';
            loginForm.style.pointerEvents = 'auto';
        }, 200);
    }

    // Show register form
    function showRegisterForm() {
        loginForm.style.transform = 'translateX(-100%)';
        registerForm.style.transform = 'translateX(0)';
        
        // Update pointer events
        setTimeout(() => {
            loginForm.style.pointerEvents = 'none';
            registerForm.style.pointerEvents = 'auto';
        }, 200);
    }

    // Add click event listeners
    signInBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });

    getStartedBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });

    switchToRegisterLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });

    switchToLoginLink?.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });

    // Initialize form state
    loginForm.style.pointerEvents = 'auto';
    registerForm.style.pointerEvents = 'none';
});
