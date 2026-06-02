import { THEME_KEYS } from '../../constants/themeConstant.js';

document.addEventListener('DOMContentLoaded', () => {
    // Theme alignment sequence
    const savedTheme = localStorage.getItem(THEME_KEYS.STORAGE_KEY) || THEME_KEYS.DARK;
    if (savedTheme === THEME_KEYS.DARK) {
        document.documentElement.classList.add('dark');
        document.body.classList.replace('bg-white', 'bg-slate-950');
    } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.replace('bg-slate-950', 'bg-white');
    }

    // Provisioning fresh credentials tracking setup
    const signupForm = document.querySelector('form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("🎉 Account Registered Successfully! Welcome to NexusTech Cloud.");
            window.location.href = '../signIn/signIn.html';
        });
    }
});