import { THEME_KEYS } from '../../constants/themeConstant.js';

const applySubPageTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEYS.STORAGE_KEY) || THEME_KEYS.DARK;
    if (savedTheme === THEME_KEYS.DARK) {
        document.documentElement.classList.add('dark');
        document.body.classList.replace('bg-white', 'bg-slate-950');
        document.body.classList.replace('text-slate-900', 'text-slate-100');
    } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.replace('bg-slate-950', 'bg-white');
        document.body.classList.replace('text-slate-100', 'text-slate-900');
    }
};

// Form submission pipeline representation
const initContactForm = () => {
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("🚀 Support Ticket Broadcasted! NexusTech infrastructure engineers will contact you shortly.");
            contactForm.reset();
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    applySubPageTheme();
    initContactForm();
    
    // Mobile menu selector hook
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if(btn && menu) btn.addEventListener('click', () => menu.classList.toggle('hidden'));
});