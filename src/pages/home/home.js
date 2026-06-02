import { initialProducts } from '../../dataBase/product.js';
import { THEME_KEYS } from '../../constants/themeConstant.js';

// Local temporary arrays managing internal storage pipelines
let products = [...initialProducts];
let currentEditId = null;

// Filter States Variables
let searchFilter = "";
let categoryFilter = "All";
let maxPriceFilter = 999;
let sortMethod = "default";
let showPremiumOnly = false;

// Target DOM Elements Pointers Safely
const cardsGrid = document.getElementById('cards-grid');
const addForm = document.getElementById('add-product-form');
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('edit-product-form');
const closeModalBtn = document.getElementById('close-modal-btn');

// UI Pointers for Search and Filter Targets
const searchInput = document.getElementById('search-input');
const filterCategory = document.getElementById('filter-category');
const filterPrice = document.getElementById('filter-price');
const sortEngine = document.getElementById('sort-engine');
const togglePremiumBtn = document.getElementById('toggle-premium');
const clearFiltersBtn = document.getElementById('clear-filters');
const pipelineCostEl = document.getElementById('pipeline-cost');

// 🧮 ANALYTICS PIPELINE ENGINE: Calculate total value cost using Array.reduce()
const calculatePipelineCost = (filteredData) => {
    if (!pipelineCostEl) return;
    const totalCost = filteredData.reduce((accumulator, item) => {
        // String Method 1: .replace() - Non-numeric templates filtering out
        const numericPrice = parseInt(item.baseline.replace(/[^0-9]/g, ''), 10) || 0;
        return accumulator + numericPrice;
    }, 0);
    pipelineCostEl.innerText = `$${totalCost}/mo`;
};

// ⚙️ RENDER PIPELINE: Processes Search, Filters, and Sorting rules altogether
const renderProducts = () => {
    if (!cardsGrid) return;

    let processedData = products.filter(product => {
        // String Method 2 & 3: .toLowerCase() & .trim() - Robust query alignment
        const cleanQuery = searchFilter.trim().toLowerCase();
        const cleanName = product.name.toLowerCase();
        const cleanSpecs = product.specs.toLowerCase();

        // String Method 4 & 5: .includes() & .startsWith() - Multilevel deep scanning evaluation
        const matchesSearch = cleanName.includes(cleanQuery) || 
                             cleanSpecs.includes(cleanQuery) ||
                             product.category.toLowerCase().startsWith(cleanQuery);
                             
        const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
        
        const productPrice = parseInt(product.baseline.replace(/[^0-9]/g, ''), 10) || 0;
        const matchesPrice = productPrice <= maxPriceFilter;

        return matchesSearch && matchesCategory && matchesPrice;
    });

    if (showPremiumOnly) {
        const hasPremiumNode = processedData.some(p => parseInt(p.baseline.replace(/[^0-9]/g, '')) >= 40);
        if (hasPremiumNode) {
            processedData = processedData.filter(p => parseInt(p.baseline.replace(/[^0-9]/g, '')) >= 40);
        } else {
            processedData = [];
        }
    }

    if (sortMethod === "price-asc") {
        processedData.sort((a, b) => parseInt(a.baseline.replace(/[^0-9]/g, '')) - parseInt(b.baseline.replace(/[^0-9]/g, '')));
    } else if (sortMethod === "price-desc") {
        processedData.sort((a, b) => parseInt(b.baseline.replace(/[^0-9]/g, '')) - parseInt(a.baseline.replace(/[^0-9]/g, '')));
    } else if (sortMethod === "name-asc") {
        processedData.sort((a, b) => a.name.localeCompare(b.name));
    }

    calculatePipelineCost(processedData);

    // Output Dynamic Generation Engine Map Setup
    cardsGrid.innerHTML = processedData.map(product => {
        // String Method 6: .toUpperCase() - Formatting categories dynamically to standard presentation format
        const boldCategory = product.category.toUpperCase();

        // String Method 7: .slice() - Limiting string overflow description metrics to maintain beautiful UI grids
        const shortSpecs = product.specs.length > 32 ? product.specs.slice(0, 32).concat("...") : product.specs;

        // String Method 8: .concat() - Append string elements programmatically during rendering
        const uiTitle = "[NODE] ".concat(product.name);

        // String Method 9: .padStart() - Visual telemetry serial key hashing sequence representation
        const mockClusterId = String(product.id % 1000).padStart(4, '0');

        // String Method 10: .repeat() - Neon quality rating level strings indicators based on cost value metrics
        const nodeRank = parseInt(product.baseline.replace(/[^0-9]/g, ''), 10) >= 40 ? "⚡".repeat(2) : "⚡".repeat(1);

        return `
            <div class="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col justify-between shadow-md dark:shadow-xl backdrop-blur-xl transition-colors duration-300">
                <div>
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-400/10 px-2.5 py-1 rounded-md uppercase tracking-wider">${boldCategory}</span>
                        <span class="text-[10px] font-mono text-slate-400">ID: #${mockClusterId} ${nodeRank}</span>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mt-3">${uiTitle}</h3>
                    <p class="text-slate-600 dark:text-slate-400 text-sm mt-1 font-mono">${shortSpecs}</p>
                </div>
                <div class="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-4">
                    <span class="text-lg font-extrabold text-slate-900 dark:text-white">${product.baseline}</span>
                    <div class="flex gap-2">
                        <button onclick="openEditModal(${product.id})" class="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-400 text-xs font-bold px-3 py-2 rounded-lg transition">Edit</button>
                        <button onclick="deleteProduct(${product.id})" class="bg-red-500/10 hover:bg-red-500 text-red-500 dark:text-red-400 hover:text-white text-xs font-bold px-3 py-2 rounded-lg transition">Delete</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
};

// 🔌 EVENT LISTENERS HOOKS FOR REALTIME SEARCH & FILTERS
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchFilter = e.target.value;
        renderProducts();
    });
}
if (filterCategory) {
    filterCategory.addEventListener('change', (e) => {
        categoryFilter = e.target.value;
        renderProducts();
    });
}
if (filterPrice) {
    filterPrice.addEventListener('change', (e) => {
        maxPriceFilter = parseInt(e.target.value, 10);
        renderProducts();
    });
}
if (sortEngine) {
    sortEngine.addEventListener('change', (e) => {
        sortMethod = e.target.value;
        renderProducts();
    });
}
if (togglePremiumBtn) {
    togglePremiumBtn.addEventListener('click', () => {
        showPremiumOnly = !showPremiumOnly;
        togglePremiumBtn.classList.toggle('bg-cyan-500/20');
        togglePremiumBtn.classList.toggle('text-cyan-400');
        renderProducts();
    });
}
if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
        searchFilter = "";
        categoryFilter = "All";
        maxPriceFilter = 999;
        sortMethod = "default";
        showPremiumOnly = false;
        
        searchInput.value = "";
        filterCategory.value = "All";
        filterPrice.value = "999";
        sortEngine.value = "default";
        togglePremiumBtn.classList.remove('bg-cyan-500/20', 'text-cyan-400');
        
        renderProducts();
    });
}

// ➕ CREATE OPERATION: Object manipulation utilizing dynamic structure creation
if (addForm) {
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newProductTarget = {};
        
        // Data Cleaning & Sanitization via Trim during insertion
        Object.assign(newProductTarget, {
            id: Date.now(),
            name: document.getElementById('prod-name').value.trim(),
            category: document.getElementById('prod-cat').value,
            specs: document.getElementById('prod-specs').value.trim(),
            baseline: `$${document.getElementById('prod-price').value}/mo`
        });

        const targetKeys = Object.keys(newProductTarget);
        const objectIsValid = targetKeys.every(key => newProductTarget[key].toString().trim() !== "");
        
        if (objectIsValid) {
            products.push(newProductTarget);
            renderProducts();
            addForm.reset();
        }
    });
}

// ❌ DELETE OPERATION: Remove items cleanly (arr.filter)
window.deleteProduct = (id) => {
    products = products.filter(product => product.id !== id);
    renderProducts();
};

// 📝 UPDATE OPERATION MODULES: Shallow Copy manipulation parsing updates using Object tools
window.openEditModal = (id) => {
    const target = products.find(p => p.id === id);
    if (!target) return;
    
    currentEditId = id;
    document.getElementById('edit-name').value = target.name;
    document.getElementById('edit-cat').value = target.category;
    document.getElementById('edit-specs').value = target.specs;
    document.getElementById('edit-price').value = target.baseline.replace(/[^0-9]/g, '');
    
    editModal.classList.remove('hidden');
    editModal.classList.add('flex');
};

if (editForm) {
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        products = products.map(product => {
            if (product.id === currentEditId) {
                const runtimeUpdates = {
                    name: document.getElementById('edit-name').value.trim(),
                    category: document.getElementById('edit-cat').value,
                    specs: document.getElementById('edit-specs').value.trim(),
                    baseline: `$${document.getElementById('edit-price').value}/mo`
                };
                
                return { ...product, ...runtimeUpdates };
            }
            return product;
        });
        
        editModal.classList.remove('flex');
        editModal.classList.add('hidden');
        renderProducts();
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        editModal.classList.remove('flex');
        editModal.classList.add('hidden');
    });
}

// 🌓 TASK 4: THEME ENGINE PERSISTENCE LOGIC (LOCALSTORAGE)
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const darkIcon = document.getElementById('theme-toggle-dark-icon');
const lightIcon = document.getElementById('theme-toggle-light-icon');

const applyTheme = (theme) => {
    const htmlElement = document.documentElement;
    if (theme === THEME_KEYS.DARK) {
        htmlElement.classList.add('dark');
        document.body.classList.replace('bg-white', 'bg-slate-950');
        document.body.classList.replace('text-slate-900', 'text-slate-100');
        
        if (darkIcon && lightIcon) {
            darkIcon.classList.add('hidden');
            lightIcon.classList.remove('hidden');
        }
    } else {
        htmlElement.classList.remove('dark');
        document.body.classList.replace('bg-slate-950', 'bg-white');
        document.body.classList.replace('text-slate-100', 'text-slate-900');
        
        if (darkIcon && lightIcon) {
            lightIcon.classList.add('hidden');
            darkIcon.classList.remove('hidden');
        }
    }
};

const toggleThemeMode = () => {
    const activeTheme = localStorage.getItem(THEME_KEYS.STORAGE_KEY) || THEME_KEYS.DARK;
    const newTheme = activeTheme === THEME_KEYS.DARK ? THEME_KEYS.LIGHT : THEME_KEYS.DARK;
    
    localStorage.setItem(THEME_KEYS.STORAGE_KEY, newTheme);
    applyTheme(newTheme);
};

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleThemeMode);
}

// Global initialization sequence loading data pools and checking theme preference immediately
document.addEventListener('DOMContentLoaded', () => {
    const savedUserPreference = localStorage.getItem(THEME_KEYS.STORAGE_KEY) || THEME_KEYS.DARK;
    applyTheme(savedUserPreference);
    renderProducts();
});