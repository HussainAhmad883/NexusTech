import { THEME_KEYS } from '../../constants/themeConstant.js';

// Global Theme Persistence Engine for Sub-Pages
const applySubPageTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEYS.STORAGE_KEY) || THEME_KEYS.DARK;
    const htmlElement = document.documentElement;
    
    if (savedTheme === THEME_KEYS.DARK) {
        htmlElement.classList.add('dark');
        document.body.classList.replace('bg-white', 'bg-slate-950');
        document.body.classList.replace('text-slate-900', 'text-slate-100');
    } else {
        htmlElement.classList.remove('dark');
        document.body.classList.replace('bg-slate-950', 'bg-white');
        document.body.classList.replace('text-slate-100', 'text-slate-900');
    }
};

// Mobile Responsive Navigation Menu Setup
const initMobileMenu = () => {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    applySubPageTheme();
    initMobileMenu();
});