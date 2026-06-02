import { THEME_KEYS } from '../../constants/themeConstant.js';

document.addEventListener('DOMContentLoaded', () => {
    // Sync Theme Storage preference
    const savedTheme = localStorage.getItem(THEME_KEYS.STORAGE_KEY) || THEME_KEYS.DARK;
    if (savedTheme === THEME_KEYS.DARK) {
        document.documentElement.classList.add('dark');
        document.body.classList.replace('bg-white', 'bg-slate-950');
    } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.replace('bg-slate-950', 'bg-white');
    }

    // Portal Login handling demo context
    const loginForm = document.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("🔒 Access Token Granted! Redirecting to central developer cluster registry...");
            window.location.href = '../../../index.html';
        });
    }
});